import React from 'react'
import Logo from '../Header/Logo'
import Image from 'next/image'
import { footerData } from "./data";
import Link from 'next/link';

const Footer = () => {
  return (
    <footer className='xl:pt-20 pb-6'>
      <div className='container'>
        <div className='flex flex-col xl:flex-row py-16 gap-10 justify-between border-b border-dark_black dark:border-white dark:border-opacity-10 border-opacity-10'>
          <div className='flex flex-col gap-6 max-w-md'>
            <div className='flex items-center gap-2'>
              <Logo />
              <span className='text-2xl font-semibold tracking-tight text-dark_black dark:text-white'>{footerData.brand.name}</span>
            </div>
            <p className='opacity-60'>{footerData.brand.tagline}</p>
            <div className='flex gap-4'>
              {footerData.brand.socialLinks.map((item, index) => {
                return (
                  <Link key={`${item.link}-${index}`} href={item.link} target="_blank" rel="noopener noreferrer" className='hover:opacity-60'>
                    <Image key={index} src={item.icon} className='dark:hidden' alt='social-icon' height={20} width={20} />
                    <Image src={item.dark_icon} className='dark:block hidden' alt='social-icon' height={20} width={20} />
                  </Link>
                )
              })}
            </div>
          </div>
          <div className='grid sm:grid-cols-3 gap-6'>
            <div className='flex flex-col gap-4'>
              <p className='text-dark_black font-medium'>{footerData.sitemap.name}</p>
              <ul className='flex flex-col gap-3'>
                {footerData.sitemap.links.map((item, index) => {
                  return (
                    <li key={`${item.url}-${index}`} className='text-dark_black opacity-60 hover:text-black hover:opacity-100 dark:text-white'>
                      <Link href={item.url}>{item.name}</Link>
                    </li>
                  )
                })}
              </ul>
            </div>
            <div className='flex flex-col gap-4'>
              <p className='text-dark_black font-medium'>{footerData.otherPages.name}</p>
              <ul className='flex flex-col gap-3'>
                {footerData.otherPages.links.map((item, index) => {
                  return (
                    <li key={`${item.url}-${index}`} className='text-dark_black opacity-60 hover:text-black hover:opacity-100 dark:text-white'>
                      <Link href={item.url}>{item.name}</Link>
                    </li>
                  )
                })}
              </ul>
            </div>
            <div className='flex flex-col gap-4'>
              <p className='text-dark_black font-medium'>{footerData.contactDetails.name}</p>
              <p className='text-dark_black opacity-60'>
                {footerData.contactDetails.address}
              </p>
              <p className='text-dark_black opacity-60 hover:text-black hover:opacity-100 dark:hover:text-white'>
                <Link href={`mailto:${footerData.contactDetails.email}`} >{footerData.contactDetails.email}</Link>
              </p>
              <p className='text-dark_black opacity-60 hover:text-black hover:opacity-100 dark:hover:text-white'>
                <Link href={`tel:${footerData.contactDetails.phone}`} >{footerData.contactDetails.phone}</Link>
              </p>
            </div>
          </div>
        </div>
        <div className='flex justify-center mt-8'>
          <p className='opacity-60'>{footerData.copyright}</p>
        </div>
      </div>
    </footer>
  )
}

export default Footer
