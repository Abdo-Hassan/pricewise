'use client';

import { Dialog, Transition } from '@headlessui/react';
import Image from 'next/image';
import { FormEvent, Fragment, useState } from 'react';
import Logo from '../public/assets/icons/logo.svg';
import Mail from '../public/assets/icons/mail.svg';
import Close from '../public/assets/icons/x-close.svg';
import { addUserEmailToProduct } from '@/lib/actions';

interface Props {
  productId: string;
}

const Modal = ({ productId }: Props) => {
  const [isOpen, setIsOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [email, setEmail] = useState('');

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsSubmitting(true);

    // add user email to product
    await addUserEmailToProduct(productId, email);

    setIsSubmitting(false);
    setEmail('');
    closeModal();
  };

  const openModal = () => setIsOpen(true);
  const closeModal = () => setIsOpen(false);

  return (
    <>
      <button type='button' className='btn' onClick={openModal}>
        Track
      </button>

      <Transition appear show={isOpen} as={Fragment}>
        <Dialog as='div' onClose={closeModal} className='dialog-container'>
          <div className='min-h-screen px-4 text-center'>
            <Transition.Child
              as={Fragment}
              enter='ease-out duration-300'
              enterFrom='opacity-0'
              enterTo='opacity-100'
              leave='ease-in duration-200'
              leaveFrom='opacity-100'
              leaveTo='opacity-0'>
              <Dialog.Overlay className='fixed inset-0' />
            </Transition.Child>

            <span
              className='inline-block h-screen align-middle'
              aria-hidden='true'
            />

            <Transition.Child
              as={Fragment}
              enter='ease-out duration-300'
              enterFrom='opacity-0 scale-95'
              enterTo='opacity-100 scale-100'
              leave='ease-in duration-200'
              leaveFrom='opacity-100 scale-100'
              leaveTo='opacity-0 scale-96'>
              <div className='dialog-content'>
                <div className='flex flex-col'>
                  <div className='flex justify-between'>
                    <div className='p-3 border border-gray-200 rounded-10'>
                      <Image src={Logo} alt='Logo' width={28} height={28} />
                    </div>

                    <Image
                      src={Close}
                      alt='close'
                      width={24}
                      height={24}
                      className='cursor-pointer'
                      onClick={closeModal}
                    />
                  </div>

                  <h4 className='dialog-head_text'>
                    Stay updated with product pricing alerts right in your
                    inbox!
                  </h4>

                  <p className='text-sm text-gray-600 mt-2'>
                    Never miss a bargain again with our timely alerts!
                  </p>
                </div>

                <form onSubmit={handleSubmit} className='flex flex-col mt-5'>
                  <label
                    htmlFor='email'
                    className='text-sm font-medium text-gray-700'>
                    Email Address
                  </label>
                  <div className='dialog-input_container'>
                    <Image src={Mail} alt='Mail' width={18} height={18} />

                    <input
                      type='email'
                      required
                      id='email'
                      placeholder='Enter your email address'
                      className='dialog-input'
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                    />
                  </div>

                  <button
                    type='submit'
                    className='dialog-btn'
                    disabled={isSubmitting}>
                    {isSubmitting ? 'Submitting ...' : 'Track'}
                  </button>
                </form>
              </div>
            </Transition.Child>
          </div>
        </Dialog>
      </Transition>
    </>
  );
};

export default Modal;
