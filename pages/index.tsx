import { useRouter } from 'next/router';
import { useEffect } from 'react';
import { useUser, useSupabaseClient } from '@supabase/auth-helpers-react';
import LoadingDots from 'components/ui/LoadingDots';
import Button from '@mui/material/Button';
import TextField from '@mui/material/TextField';
import ChatIcon from '@mui/icons-material/Chat';
import SearchIcon from '@mui/icons-material/Search';
import Link from 'next/link';

interface CardProps {
    title: string;
    description?: string;
}
function Card({ title, description }: CardProps) {
    return (
        <div className="border border-zinc-700	max-w-3xl w-full p rounded-md m-auto my-8">
            <div className="p-3">
                <h3 className="text-2xl mb-1 font-medium">{title}</h3>
                <p className="text-zinc-300">{description}</p>
            </div>
            <div className="border-t border-zinc-700 bg-zinc-900 p-4 text-zinc-500 rounded-b-md">
                <Link href="/practise">
                    <Button variant="contained" endIcon={<ChatIcon />}>
                        Start practise
                    </Button>
                </Link>
            </div>
        </div>
    );
}

const HomePage = () => {
    const router = useRouter();
    const user = useUser();

    useEffect(() => {
        if (user) {
            router.replace('/account');
        }
    }, [user]);

    if (!user)
        return (
            <div className="flex">
                <div className="justify-between max-w-sm p-3 mx-auto w-80">
                    <div className='text-center'>
                        <h1 className="text-3xl font-extrabold text-white">
                            Popular interview questions
                        </h1>
                    </div>
                    <div className="flex flex-col space-y-4">
                        <Card
                            title="Customer Service"
                            description="How would you improve the experience of dissatisfied customers?"
                        />
                        <Card
                            title="Bookkeeper"
                            description="How do you intend to keep mistakes at a minimum?"
                        />
                    </div>
                    <div className='text-center mt-5'>
                        <h1 className="text-3xl font-extrabold text-white">
                            Search by job title
                        </h1>
                        <TextField fullWidth label="Enter Job Title" variant="outlined" />
                        <Button fullWidth variant="contained" startIcon={<SearchIcon />}>
                            Search
                        </Button>
                    </div>
                </div>
            </div>
        );

    return (
        <div className="m-6">
            <LoadingDots />
        </div>
    );
};

export default HomePage;
