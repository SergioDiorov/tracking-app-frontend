'use client';

// react
import React, { useState } from 'react';

// components
import Modal from '@/components/assets/Modal';
import { Button } from '@/components/ui/button';

const Organizations = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);

  return (
    <div className='flex flex-col justify-center items-center gap-5 mt-10'>
      <p className='text-xl font-semibold'>
        You’re not a participant of any organization
      </p>
      <Button onClick={() => setIsModalOpen(true)} className='w-fit'>
        Create organization
      </Button>
      <Modal
        open={isModalOpen}
        onOpenChange={setIsModalOpen}
        title='Create organization'
        acceptButtonText='Create'
      >
        Create organization form
      </Modal>
    </div>
  );
};

export default Organizations;
