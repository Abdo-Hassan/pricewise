import { getProductById, getSimilarProducts } from '@/lib/actions';
import Image from 'next/image';
import Link from 'next/link';
import { redirect } from 'next/navigation';
import Heart from '../../../public/assets/icons/black-heart.svg';
import Bookmark from '../../../public/assets/icons/bookmark.svg';
import Share from '../../../public/assets/icons/share.svg';
import Comment from '../../../public/assets/icons/comment.svg';
import Star from '../../../public/assets/icons/star.svg';
import Chart from '../../../public/assets/icons/chart.svg';
import Highest from '../../../public/assets/icons/arrow-up.svg';
import Buy from '../../../public/assets/icons/bag.svg';
import Lowest from '../../../public/assets/icons/arrow-down.svg';
import PriceTag from '../../../public/assets/icons/price-tag.svg';
import { formatNumber } from '@/lib/utils';
import PriceInfoCard from '@/components/PriceInfoCard';
import ProductCard from '@/components/ProductCard';
import Modal from '@/components/Modal';

type Props = {
  params: { id: string };
};
const ProductDetails = async ({ params: { id } }: Props) => {
  const product = await getProductById(id);
  const similarProducts = await getSimilarProducts(id);

  if (!product) redirect('/');

  return (
    <div className='product-container'>
      <div className='flex gap-28 xl:flex-row flex-col'>
        {/* product image */}
        <div className='product-image'>
          <Image
            src={product.image}
            alt={product.title}
            width={580}
            height={400}
            className='mx-auto'
          />
        </div>

        {/* product header */}
        <div className='flex-1 flex flex-col'>
          <div className='flex justify-between items-start gap-5 flex-wrap pb-6'>
            <div className='flex flex-col gap-3'>
              <p className='text-[28px] text-secondary font-semibold'>
                {product.title}
              </p>

              <Link
                href={product.url}
                target='_blank'
                className='text-base text-black opacity-50'>
                Visit Product
              </Link>
            </div>

            {/* product favorites & reviews */}
            <div className='flex items-center gap-3'>
              <div className='product-hearts'>
                <Image src={Heart} alt='Heart' width={20} height={20} />

                <p className='text-base font-semibold text-[#D46f77]'>
                  {product.reviewsCount}
                </p>
              </div>

              <div className='p-2 bg-white-200 rounded-10'>
                <Image src={Bookmark} alt='Bookmark' width={20} height={20} />
              </div>

              <div className='p-2 bg-white-200 rounded-10'>
                <Image src={Share} alt='Share' width={20} height={20} />
              </div>
            </div>
          </div>
          {/* product prices */}
          <div className='product-info'>
            <div className='flex flex-col gap-2'>
              <p className='text-[34px] text-secondary font-bold'>
                {product.currency} {formatNumber(product.currentPrice)}
              </p>
              <p className='text-[21px] text-black opacity-50 line-through'>
                {product.currency} {formatNumber(product.originalPrice)}
              </p>
            </div>

            {/* Product reviews */}
            <div className='flex flex-col gap-4'>
              <div className='flex gap-3'>
                <div className='product-stars'>
                  <Image src={Star} alt='Star' width={16} height={16} />

                  <p className='text-sm text-primary-orange font-semibold'>
                    {product.stars || '4.5'}
                  </p>
                </div>

                <div className='product-reviews'>
                  <Image src={Comment} alt='Comment' width={16} height={16} />
                  <p className='text-sm text-secondary font-semibold'>
                    {product.reviewsCount} Reviews
                  </p>
                </div>
              </div>

              <p className='text-sm text-black opacity-50'>
                <span className='text-primary-green font-semibold'>93%</span> of
                byers have recommended this.
              </p>
            </div>
          </div>
          {/* Price Card */}
          <div className='my-7 flex flex-col gap-5'>
            <div className='flex gap-5 flex-wrap'>
              <PriceInfoCard
                title='Current Price'
                iconSrc={PriceTag}
                value={`${product.currency} ${formatNumber(
                  product.currentPrice
                )}`}
              />
              <PriceInfoCard
                title='Average Price'
                iconSrc={Chart}
                value={`${product.currency} ${formatNumber(
                  product.averagePrice
                )}`}
              />
              <PriceInfoCard
                title='Highest Price'
                iconSrc={Highest}
                value={`${product.currency} ${formatNumber(
                  product.highestPrice
                )}`}
              />
              <PriceInfoCard
                title='Lowest Price'
                iconSrc={Lowest}
                value={`${product.currency} ${formatNumber(
                  product.lowestPrice
                )}`}
              />
            </div>
          </div>
          {/* Modal */}
          <Modal productId={product._id!} />
        </div>
      </div>

      {/* footer */}
      <div className='flex flex-col gap-16'>
        <div className='flex flex-col gap-5'>
          <h3 className='text-2xl text-secondary font-semibold'>
            Product Description
          </h3>

          <div className='flex flex-col gap-4'>
            {product?.description?.split('\n')}
          </div>
        </div>

        {/* Buy Now */}
        <button className='btn w-fit mx-auto flex items-center justify-center gap-3 min-w-[200px]'>
          <Image src={Buy} alt='Check' width={22} height={22} />

          <Link
            href={product.url}
            className='text-base text-white'
            target='_blank'>
            Buy Now
          </Link>
        </button>
      </div>

      {similarProducts && similarProducts?.length > 0 && (
        <div className='py-14 flex flex-col gap-2 w-full'>
          <p className='section-text'>Similar Products</p>

          <div className='flex flex-wrap gap-10 mt-7 w-full'>
            {similarProducts?.map((similarProduct) => (
              <ProductCard key={product._id} product={similarProduct} />
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default ProductDetails;
