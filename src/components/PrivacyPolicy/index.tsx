"use client"

import Link from "next/link"

function PrivacyPolicy() {
    return (
        <section>
            <div
                className="relative w-full pt-44 2xl:pb-20 pb-10 before:absolute before:w-full before:h-full before:bg-gradient-to-r before:from-blue_gradient before:via-white before:to-yellow_gradient before:rounded-full before:top-24 before:blur-3xl before:-z-10"
            >
                <div className="container relative z-10">
                    <div className='flex flex-col gap-10 xl:gap-20'>
                        <h1 className='md:text-6xl text-4xl font-medium text-center'>
                            Privacy Policy
                        </h1>
                        <div className="bg-white p-8 rounded-2xl">
                            <p className="text-opacity-60">
                                This Privacy Policy explains how Hue Sixteen ("we", "our", "us") collects, uses, and protects personal information when you use our website and services, including <Link href="https://huesixteen.com" className="text-dark_black">https://huesixteen.com</Link>.
                            </p>

                            <p className="text-opacity-60">By using this website, you agree to the data practices described in this policy, including collection, usage, storage, and security of your information for service delivery and communication.</p>

                            <p className="text-opacity-60">Our website may include links to third-party services. We are not responsible for the privacy practices of third-party websites and recommend reviewing their policies separately.</p>

                            <p className="text-opacity-60">We may update this Privacy Policy from time to time. Updated versions will be posted on this page. Please review this page periodically to stay informed.</p>

                            <div className="my-6">
                                <h4 className="font-semibold">Personal information collection </h4>
                                <p className="mt-6 opacity-60">
                                    We may collect personal information that you provide directly, such as your name, email address, company details, and project requirements when you submit forms or contact us.
                                </p>

                                <p className="mt-6 text-opacity-60">
                                    We do not intentionally collect sensitive payment data directly through this website. If payment processing is used, it is handled through trusted third-party providers under their own policies.
                                </p>

                            </div>
                            <div className="my-6">
                                <h4 className="font-semibold">Personal information you provide to us</h4>
                                <p className="mt-6 text-opacity-60">
                                    Information you submit is used to respond to inquiries, provide requested services, and improve user experience. We keep your data only as long as necessary for legitimate business purposes.
                                </p>
                                <p className="mt-6 text-opacity-60">
                                    For any privacy-related request, you can contact us at <Link href="mailto:huesixteen@gmail.com" className="text-dark_black">huesixteen@gmail.com</Link>.
                                </p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </section >
    )
}

export default PrivacyPolicy

