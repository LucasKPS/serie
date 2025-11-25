'use client';

import * as React from 'react';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { AlertTriangle, Eye, EyeOff, Loader2, Clapperboard } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { useUser } from '@/firebase/auth/use-user';
import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { useToast } from '@/hooks/use-toast';
import { useFirebase } from '@/firebase';
import { signInWithEmail, signUpWithEmail } from '@/firebase/auth/auth-service';
import './auth.css';
import { cn } from '@/lib/utils';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';

const formSchema = z.object({
  displayName: z.string().optional(),
  email: z.string().email({ message: 'Por favor, insira um e-mail válido.' }),
  password: z
    .string()
    .min(6, { message: 'A senha deve ter pelo menos 6 caracteres.' }),
});

type FormValues = z.infer<typeof formSchema>;

export default function AuthPage() {
  const [isSignUp, setIsSignUp] = React.useState(false);
  const [isLoading, setIsLoading] = React.useState(false);
  const [authError, setAuthError] = React.useState<string | null>(null);
  const [showPassword, setShowPassword] = React.useState(false);

  const { auth, firestore } = useFirebase();
  const { user, isUserLoading } = useUser();
  const router = useRouter();
  const { toast } = useToast();

  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      displayName: '',
      email: '',
      password: '',
    },
  });

  React.useEffect(() => {
    if (!isUserLoading && user) {
      router.replace('/preferences');
    }
  }, [user, isUserLoading, router]);

  const handleAuthSuccess = (user: any) => {
    setIsLoading(false);
    toast({
      title: isSignUp ? 'Cadastro realizado!' : 'Login efetuado!',
      description: `Bem-vindo(a) de volta, ${user.email}!`,
    });
    router.push('/preferences');
  };

  const handleAuthError = (error: any) => {
    setIsLoading(false);
    let friendlyMessage = 'Ocorreu um erro. Por favor, tente novamente.';
    if (error.code) {
      switch (error.code) {
        case 'auth/invalid-credential':
        case 'auth/user-not-found':
        case 'auth/wrong-password':
          friendlyMessage = 'E-mail ou senha inválidos. Por favor, tente novamente.';
          break;
        case 'auth/email-already-in-use':
          friendlyMessage = 'Este e-mail já está em uso. Por favor, tente fazer login.';
          break;
        default:
          console.error('Auth Error:', error);
      }
    }
    setAuthError(friendlyMessage);
  };


  const onSubmit = async (values: FormValues) => {
    setIsLoading(true);
    setAuthError(null);

    try {
      if (isSignUp) {
        if (!values.displayName) {
          form.setError('displayName', { message: "O nome é obrigatório" });
          setIsLoading(false);
          return;
        }
        const userCredential = await signUpWithEmail(auth, firestore, values, values.displayName);
        handleAuthSuccess(userCredential.user);
      } else {
        const userCredential = await signInWithEmail(auth, values);
        handleAuthSuccess(userCredential.user);
      }
    } catch (error) {
      handleAuthError(error);
    }
  };
  
  if (isUserLoading || user) {
    return (
      <div className="flex h-screen w-full items-center justify-center bg-background">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <div className="auth-page flex min-h-screen w-full flex-col p-4">
      <main className="flex flex-grow items-center justify-center">
        <Card className="w-full max-w-sm bg-card/60">
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)}>
              <CardHeader className="text-center">
                <div className="flex justify-center items-center gap-2 mb-4">
                  <Clapperboard className="w-8 h-8 text-accent"/>
                  <span className="text-2xl font-headline">CineScope</span>
                </div>
                <CardTitle className="text-2xl font-headline">
                  {isSignUp ? 'Criar uma Conta' : 'Bem-vindo de Volta!'}
                </CardTitle>
                <CardDescription>
                  {isSignUp
                    ? 'Preencha os campos para se cadastrar.'
                    : 'Digite suas credenciais para acessar sua conta.'}
                </CardDescription>
              </CardHeader>
              <CardContent className="grid gap-4">
                {isSignUp && (
                  <FormField
                    control={form.control}
                    name="displayName"
                    render={({ field }) => (
                      <FormItem className="transition-transform duration-200 hover:scale-105">
                        <FormControl>
                          <Input placeholder="Nome" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                )}
                <FormField
                  control={form.control}
                  name="email"
                  render={({ field }) => (
                    <FormItem className="transition-transform duration-200 hover:scale-105">
                      <FormControl>
                        <Input
                          type="email"
                          placeholder="Email"
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="password"
                  render={({ field }) => (
                    <FormItem className="transition-transform duration-200 hover:scale-105">
                      <FormControl>
                        <div className="relative">
                          <Input
                            type={showPassword ? 'text' : 'password'}
                            placeholder="Senha"
                            {...field}
                          />
                          <Button
                            type="button"
                            variant="ghost"
                            size="icon"
                            className="absolute right-1 top-1/2 h-7 w-7 -translate-y-1/2 text-muted-foreground"
                            onClick={() => setShowPassword(!showPassword)}
                          >
                            {showPassword ? <EyeOff /> : <Eye />}
                          </Button>
                        </div>
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </CardContent>
              <CardFooter className="flex flex-col gap-4">
                {authError && (
                  <Alert variant="destructive">
                  <AlertTriangle className="h-4 w-4" />
                  <AlertTitle>Erro de Autenticação</AlertTitle>
                  <AlertDescription>
                    {authError}
                  </AlertDescription>
                </Alert>
                )}
                <Button className="w-full" type="submit" disabled={isLoading}>
                  {isLoading && (
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  )}
                  {isSignUp ? 'Cadastrar' : 'Entrar'}
                </Button>
                <div className="text-center text-sm text-muted-foreground">
                  {isSignUp ? 'Já tem uma conta?' : 'Não tem uma conta?'}
                  <Button
                    variant="link"
                    type="button"
                    onClick={() => {
                      setIsSignUp(!isSignUp);
                      setAuthError(null);
                      form.reset();
                    }}
                    className="p-1"
                  >
                    {isSignUp ? 'Entrar' : 'Cadastre-se'}
                  </Button>
                </div>
              </CardFooter>
            </form>
          </Form>
        </Card>
      </main>
      <footer className="py-4 text-center text-xs text-white/50">
        <p>&copy; 2025 CineScope. Todos os direitos reservados.</p>
      </footer>
    </div>
  );
}
