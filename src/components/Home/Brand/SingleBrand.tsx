import { brandList } from "@/app/api/data";
import Image from "next/image";

const SingleBrand = ({ brand }: { brand: typeof brandList[number] }) => {
    const { image, title, darkImg } = brand;

    return (
        <div className="inline-flex items-center gap-2">
                <Image
                    src={image}
                    alt={title}
                    height={50}
                    width={50}
                    className="dark:hidden swiper-logo-image h-10 w-10 object-contain"
                />
                <Image
                    src={darkImg}
                    alt={title}
                    height={50}
                    width={50}
                    className="dark:block hidden swiper-logo-image h-10 w-10 object-contain"
                />
                <p
                    className="text-[17px] font-bold whitespace-nowrap text-[#0C0B10] dark:text-[#0C0B10]"
                >
                    {title}
                </p>
        </div>
    );
};

export default SingleBrand;




