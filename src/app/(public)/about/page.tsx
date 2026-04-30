export default function AboutPage() {
  return (
    <div className="container mx-auto px-4 py-16">
      <div className="max-w-3xl mx-auto text-center">
        <h1 className="text-4xl font-bold mb-6">About StepKicks</h1>
        <p className="text-lg text-muted-foreground mb-8">
          Welcome to StepKicks, Sri Lanka's premium destination for authentic sneakers and luxury bags. 
          Founded with a passion for streetwear culture and high-end fashion, we bring you the most exclusive 
          collections at unbeatable prices.
        </p>
        <div className="grid md:grid-cols-3 gap-8 mt-16 text-left">
          <div className="p-6 bg-muted/30 rounded-xl">
            <h3 className="font-bold text-xl mb-3">100% Authentic</h3>
            <p className="text-muted-foreground">Every item we sell is thoroughly inspected by our experts to guarantee its authenticity. Shop with complete confidence.</p>
          </div>
          <div className="p-6 bg-muted/30 rounded-xl">
            <h3 className="font-bold text-xl mb-3">Premium Service</h3>
            <p className="text-muted-foreground">We offer a personalized shopping experience through our dedicated WhatsApp support line. Your satisfaction is our priority.</p>
          </div>
          <div className="p-6 bg-muted/30 rounded-xl">
            <h3 className="font-bold text-xl mb-3">Fast Delivery</h3>
            <p className="text-muted-foreground">Enjoy fast and secure island-wide delivery. We ensure your luxury items reach you in perfect condition.</p>
          </div>
        </div>
      </div>
    </div>
  );
}
