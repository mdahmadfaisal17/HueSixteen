'use client';
import { faqList } from "@/app/api/data";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";

function Faq() {
    return (
        <section>
            <div className="2xl:py-20 py-11">
                <div className="container">
                    <div className="flex flex-col gap-10 md:gap-20">
                        <div className="max-w-2xl text-center mx-auto">
                            <h2>
                                <span className="block">Still Have A</span>
                                <span className="block dark:opacity-70">Few Questions?</span>
                            </h2>
                        </div>
                        <div className="flex flex-col">
                            <Accordion type="single" collapsible className="flex flex-col gap-4">
                                {faqList.map((item, index) => (
                                    <AccordionItem 
                                        key={index} 
                                        value={`item-${index}`}
                                        className="p-6 border border-dark_black/10"
                                    >
                                        <AccordionTrigger>
                                            <h4 className="text-dark_black">{item.faq_que}</h4>
                                        </AccordionTrigger>
                                        <AccordionContent>
                                            <p>{item.faq_ans}</p>
                                        </AccordionContent>
                                    </AccordionItem>
                                ))}
                            </Accordion>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
}

export default Faq;
