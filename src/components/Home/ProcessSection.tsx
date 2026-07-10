const processSteps = [
  {
    step: "01",
    title: "Discovering Your Brand Vision",
  },
  {
    step: "02",
    title: "Defining Your Creative Direction",
  },
  {
    step: "03",
    title: "Crafting Visual Brand Assets",
  },
  {
    step: "04",
    title: "Refining & Final Delivery",
  },
];

function ProcessSection() {
  return (
    <section className="2xl:py-20 py-11">
      <div className="container">
        <div className="flex flex-col justify-center items-center gap-10 md:gap-20">
          <div className="max-w-3xl mx-auto text-center flex flex-col gap-4">
            <h2>
              <span className="block">Our Proven</span>
              <span className="block">Brand Building Process</span>
            </h2>
          </div>
          <div className="grid md:grid-cols-2 xl:grid-cols-4 gap-6">
            {processSteps.map((item, index) => (
              <div
                key={item.step}
                className={
                  `rounded-3xl p-6 h-60 flex flex-col justify-center gap-2 transform ${index % 2 === 0 ? 'rotate-6' : '-rotate-6'} ${index === 1 || index === 3 ? 'translate-y-10' : ''} ${index === 1 || index === 2 ? "text-white" : "bg-slate-100 text-dark_black"}`
                }
                style={
                  index === 1
                    ? {
                        backgroundImage: "linear-gradient(to bottom, #FC7035 0%, #FC7035 45%, #FFEAE0 100%)",
                      }
                    : index === 2
                    ? {
                        backgroundImage: "linear-gradient(to bottom, #4E29FF 0%, #4E29FF 45%, #F4E3FF 100%)",
                      }
                    : undefined
                }
              >
                <div className="h-full flex flex-col justify-center items-center text-center">
                  <span className={`text-base ${index === 1 || index === 2 ? "text-white/80" : "opacity-70 dark:text-dark_black"}`}>Step {item.step}</span>
                  <h4 className={`text-3xl font-semibold ${index === 1 || index === 2 ? "text-white" : "text-dark_black dark:text-dark_black"}`}>{item.title}</h4>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

export default ProcessSection;
