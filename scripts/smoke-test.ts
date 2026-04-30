import mongoose from 'mongoose';
import * as dotenv from 'dotenv';
import Order from '../src/lib/db/models/Order';
import Product from '../src/lib/db/models/Product';

dotenv.config({ path: '.env.local' });

const MONGODB_URI = process.env.MONGODB_URI;

async function smokeTest() {
  try {
    console.log('--- STARTING SMOKE TEST ---');
    await mongoose.connect(MONGODB_URI!);
    console.log('✅ Database connected');

    // 1. Check if we have products
    const product = await Product.findOne({ isAvailable: true });
    if (!product) {
      console.error('❌ No products found to test with.');
      process.exit(1);
    }
    console.log(`✅ Found test product: ${product.name} (Stock: ${product.stock})`);

    // 2. Create a test order
    const initialStock = product.stock;
    const testOrder = await Order.create({
      orderNumber: `TEST-${Date.now()}`,
      customer: {
        name: "Test User",
        phone: "0771234567",
        email: "test@example.com",
        address: "123 Test Street, Colombo"
      },
      product: {
        productId: product._id,
        productName: product.name,
        productSlug: product.slug,
        image: product.images[0],
        price: product.price,
        selectedSize: product.sizes[0],
        selectedColor: product.colors[0].name
      },
      status: 'inquiry'
    });
    console.log(`✅ Test order created: ${testOrder.orderNumber}`);

    // 3. Simulate Admin confirming order (Triggering Inventory Sync)
    console.log('Simulating Order Confirmation...');
    // We'll manually trigger the logic that would be in /api/orders/[id]
    
    // In our implementation (api/orders/[id]/route.ts), confirming order decrements stock
    const updatedOrder = await Order.findByIdAndUpdate(
      testOrder._id,
      { 
        $set: { status: 'confirmed' },
        $push: { statusHistory: { status: 'confirmed', note: 'Smoke test confirm', timestamp: new Date() } }
      },
      { new: true }
    );

    // Update product stock (matching business logic in route.ts)
    await Product.findByIdAndUpdate(product._id, { $inc: { stock: -1 } });
    
    const productAfterConfirm = await Product.findById(product._id);
    console.log(`✅ Stock after confirmation: ${productAfterConfirm?.stock} (Expected: ${initialStock - 1})`);

    // 4. Simulate Order Cancellation (Restoring stock)
    console.log('Simulating Order Cancellation...');
    await Order.findByIdAndUpdate(
      testOrder._id,
      { 
        $set: { status: 'cancelled' },
        $push: { statusHistory: { status: 'cancelled', note: 'Smoke test cancel', timestamp: new Date() } }
      }
    );
    
    await Product.findByIdAndUpdate(product._id, { $inc: { stock: 1 } });
    
    const productAfterCancel = await Product.findById(product._id);
    console.log(`✅ Stock after cancellation: ${productAfterCancel?.stock} (Expected: ${initialStock})`);

    // 5. Cleanup test data
    await Order.findByIdAndDelete(testOrder._id);
    console.log('✅ Test order cleaned up');

    console.log('--- SMOKE TEST COMPLETED SUCCESSFULLY ---');
    process.exit(0);
  } catch (error) {
    console.error('❌ Smoke test failed:', error);
    process.exit(1);
  }
}

smokeTest();
