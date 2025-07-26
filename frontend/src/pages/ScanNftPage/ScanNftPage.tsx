import { CheckCircle, CircleAlert } from 'lucide-react';
import { FC, useEffect, useState } from 'react';
import { useSearchParams } from "react-router-dom";
import { createActor as createNftActor, canisterId as nftCanisterId } from 'declarations/nft';
import toastNotifications from '../../utils/toastNotifications.utils';
import { AuthClient } from '@dfinity/auth-client';
import { Realtime } from "ably";

const ably = new Realtime({ key: "b_2_wA.WNGPXw:iksvvgxXbSaB4VDl1S3ZkL0r7TGz3GjdoAG6d5eZkGA" });

const ScanNftPage: FC = () => {
    const [searchParams, setSearchParams] = useSearchParams();
    const ownerParamName = 'currentOwner';
    const nftIdParamName = 'nftId';
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState('');
    const [success, setSuccess] = useState(false);

    const handleUseNftHelper = async (nftId: string, owner: string) => {
        const authClient = await AuthClient.create();
        const identity = authClient.getIdentity();
        const nftActor = createNftActor(nftCanisterId, {
            agentOptions: {
                identity: identity,
            },
        });
        const now = new Date().getTime();
        await nftActor.use_nft(
            owner,
            now,
            nftId
        );

        return now;
    };

    const handleUseNft = async () => {
        try {
            setIsLoading(() => true);
            const ownerParam = searchParams.get(ownerParamName);
            const nftIdParam = searchParams.get(nftIdParamName);
            if (nftIdParam && ownerParam) {
                const usageTime = await handleUseNftHelper(nftIdParam, ownerParam)
                setSuccess(true);
                const channel = ably.channels.get("qr-scan");
                channel.publish("scan", { nftIdParam, ownerParam, usageTime  });
                console.log('publish')
            }
        } catch (err) {
            setError(err.message);
            setSuccess(false)
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        window.scrollTo({ top: 0 });
        handleUseNft();
    }, []);

    return (
        <main className='flex justify-center items-center min-h-[90vh] container mx-auto py-12 px-4'>
            <div>

                {!!isLoading &&
                    <div className='flex flex-col gap-4 items-center'>
                        <div className='animate-spin size-16 border-4 mb-10 border-green-500  border-t-transparent rounded-full' />
                        <div className='font-semibold text-lg'>
                            Scanning the QR code...
                        </div>
                    </div>
                }

                {!isLoading && (!searchParams.get(ownerParamName) || !searchParams.get(nftIdParamName)) &&
                    <div className='flex flex-col gap-4 items-center'>
                        <CircleAlert className='size-16 text-red-600' />
                        <div className='font-semibold text-xl text-center'>
                            The params were not specified for scan request
                        </div>
                    </div>
                }

                {!isLoading && !!error &&
                    <div className='flex flex-col gap-4 items-center'>
                        <CircleAlert className='size-16 text-red-600' />
                        <div className='font-semibold text-xl text-center'>
                            Error occurred while scanning QR code: {error}
                        </div>
                    </div>
                }

                {!isLoading && success &&
                    <div className='flex flex-col gap-4 items-center'>
                        <CheckCircle className='size-16 text-green-500' />
                        <div className='font-semibold text-xl text-center'>
                            Congrats! QR code was successfully scanned!
                        </div>
                    </div>
                }

            </div>
        </main>
    )
}

export default ScanNftPage;