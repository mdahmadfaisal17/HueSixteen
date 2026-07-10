import Image from "next/image";

function OfficeLocation() {
  return (
    <section>
      <div className="2xl:py-20 py-11">
        <div className="container">
          <div className="rounded-[32px] bg-white p-6 md:p-10">
            <div className="max-w-2xl text-center mx-auto">
              <h2>
                <span className="block">Creative Talent</span>
                <span className="block dark:opacity-70">Across Two Countries</span>
              </h2>
            </div>

            <div className="mt-12 mx-auto max-w-5xl md:mt-14">
              <div className="relative">
                <div className="overflow-hidden rounded-[28px] bg-white">
                  <Image
                    src="/images/office-location.png"
                    alt="World map showing office locations"
                    width={1440}
                    height={720}
                    className="h-auto w-full"
                    unoptimized={true}
                  />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

export default OfficeLocation;
