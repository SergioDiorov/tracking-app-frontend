// react
import React from 'react';

// next
import Link from 'next/link';

// redux
import organizationSelectors from '@/redux/organization/organizationSelectors';
import userSelectors from '@/redux/user/userSelectors';
import { useAppSelector } from '@/redux/hooks';

// components
import { Card } from '@/components/ui/card';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';

const InfoData = ({
  title,
  data,
}: {
  title: string;
  data: string | number;
}) => {
  return (
    <p className='text-sm font-medium text-primary/70'>
      {title}:{' '}
      <span className='text-sm font-medium text-primary/90'>{data}</span>
    </p>
  );
};

const UserInfo = () => {
  const {
    avatar: userAvatar,
    firstName,
    lastName,
    email,
    age,
    country,
    city,
    workPreference,
  } = useAppSelector(userSelectors.getUserData);

  const {
    avatar: organizationAvatar,
    name,
    corporateEmail,
    registrationCountry,
    industry,
    website,
  } = useAppSelector(organizationSelectors.getOrganizationData);

  return (
    <Card className='p-4 w-full flex gap-4 flex-col lg:flex-row'>
      <div className='w-full lg:w-1/2'>
        <div className='flex gap-4'>
          <Avatar className='hidden lg:block size-[108px]'>
            <AvatarImage src={userAvatar || ''} alt='Avatar' />
            <AvatarFallback>{firstName[0] + lastName[0]}</AvatarFallback>
          </Avatar>
          <div>
            <div className='flex items-center'>
              <Avatar className='lg:hidden size-5 mr-1'>
                <AvatarImage src={userAvatar || ''} alt='Avatar' />
                <AvatarFallback>{firstName[0] + lastName[0]}</AvatarFallback>
              </Avatar>
              <p className='text-sm xl:text-xl font-semibold text-card-foreground/60'>
                {firstName} {lastName}
              </p>
            </div>
            <InfoData title='Email' data={email} />
            <InfoData title='Age' data={age} />
            <InfoData title='Place' data={country + ', ' + city} />
            <InfoData title='Work preference' data={workPreference} />
          </div>
        </div>
      </div>
      <div className='w-full lg:w-1/2'>
        <div className='text-sm xl:text-xl font-semibold text-card-foreground/60 flex gap-1 items-center'>
          Member of{' '}
          <Link
            href={'/organizations'}
            className='flex items-center justify-center gap-1 text-card-foreground/70 hover:text-card-foreground/50 group transition pl-1'
          >
            <Avatar className='size-5 relative -top-px group-hover:opacity-70 transition'>
              <AvatarImage
                src={organizationAvatar || ''}
                alt='Organization avatar'
              />
              <AvatarFallback>{name[0]}</AvatarFallback>
            </Avatar>
            {name}
          </Link>
        </div>
        <InfoData title='Corporate email' data={corporateEmail} />
        <InfoData title='Rregistration country' data={registrationCountry} />
        <InfoData title='Industry' data={industry} />
        <div className='flex items-center gap-1'>
          <InfoData title='Website' data={''} />{' '}
          <a
            href={website}
            target='_blank'
            rel='noopener noreferrer'
            className='text-sm font-medium text-primary/90 underline hover:text-primary/70 transition'
          >
            {name
              ? name[0].toLowerCase() +
                name.slice(1).replaceAll(' ', '') +
                '.com'
              : 'link'}
          </a>
        </div>
      </div>
    </Card>
  );
};

export default UserInfo;
