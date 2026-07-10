import Image from 'next/image';
import Link from 'next/link';

interface HeaderProps {
    withLink?: boolean;
}

const Logo: React.FC<HeaderProps> = ({ withLink = true }) => {
    const logoImage = (
        <Image
            src="/images/logo/Logo.svg"
            alt="logo"
            width={44}
            height={44}
            quality={100}
            priority={true}
            className='h-11 w-11'
        />
    );

    if (!withLink) {
        return logoImage;
    }

    return (
        <Link href="/" className="inline-flex items-center">
            {logoImage}
        </Link>
    );
};

export default Logo;
