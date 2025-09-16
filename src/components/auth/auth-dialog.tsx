import React from 'react'
import DialogContent, { Dialog, } from '../ui/dialog';
import { Button } from '../ui/button';
import { FcGoogle } from "react-icons/fc";
import { FaGithub, FaGitlab } from 'react-icons/fa6';
import { signIn } from 'next-auth/react';
import { ProgressCircle } from '../ui/progress';
const AuthDialog = () => {
    const [open, setOpen] = React.useState(false)
    const [loadingProvider, setLoadingProvider] = React.useState<null | 'google' | "github" | "gitlab">(null);
    const providerSignIn = async (provider: 'google' | 'github' | "gitlab") => {
        setLoadingProvider(provider);

        try {
            await signIn(provider, { callbackUrl: '/', redirect: true });
        } catch (error) {
            console.log(error)
            setLoadingProvider(null);
        } finally {
            setLoadingProvider(null);
        }
    };
    return (
        <Dialog open={open} onOpenChange={setOpen} >
            <div className='flex items-center gap-2'>
                <Button variant={"outline"} onClick={() => setOpen(true)}
                    className='h-10 rounded-full text-black font-semibold'>Criar conta</Button>
                <Button onClick={() => setOpen(true)}
                    variant={"outline"} className='h-10 rounded-full bg-[#262626] border-muted-foreground font-bold'>Entrar</Button>
            </div>
            <DialogContent className="sm:max-w-3xl w-full space-y-10 bg-[#262626] outline-none text-white border-none [&>button]:hidden" >
                <div className="">
                    <h2 className="text-center text-base md:text-2xl ">
                        Conheça o seu companheiro de IA
                    </h2>
                    <p className='text-center text-sm md:text-base'>Crie uma conta ou inicie sessão para manter todas as suas conversas. </p>
                </div>

                <div className="flex items-center justify-center flex-col gap-4">
                    <Button onClick={() => providerSignIn("google")}  className='h-12 w-[320px] rounded-full font-bold bg-[#262626] border-muted-foreground border'>
                        {loadingProvider === 'google' ? (
                            <ProgressCircle value={15} size={15} strokeWidth={2} className="text-white animate-spin" />
                        ) : (
                            <>
                                <FcGoogle />  Continuar com Google
                            </>
                        )}
                    </Button>
                    <Button onClick={() => providerSignIn("github")} className='h-12 w-[320px] rounded-full font-bold bg-[#262626] border-muted-foreground border'>
                        {loadingProvider === 'github' ? (
                            <ProgressCircle value={15} size={15} strokeWidth={2} className="text-white animate-spin" />
                        ) : (
                            <>
                                <FaGithub /> Continuar com GitLab
                            </>
                        )}
                    </Button>
                    <Button onClick={() => providerSignIn("gitlab")} className='h-12 w-[320px] rounded-full font-bold bg-[#262626] border-muted-foreground border'>
                        {loadingProvider === 'gitlab' ? (
                            <ProgressCircle value={15} size={15} strokeWidth={2} className="text-white animate-spin" />
                        ) : (
                            <>
                                <FaGitlab />  Continuar com Gitlab
                            </>
                        )}
                    </Button>
                </div>
            </DialogContent>
        </Dialog>
    );
}

export default AuthDialog