
'use client';

import * as React from 'react';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { Loader2 } from 'lucide-react';
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
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { useToast } from '@/hooks/use-toast';
import { useFirebase } from '@/firebase';
import { signInWithEmail, signUpWithEmail } from '@/firebase/auth/auth-service';
import { onAuthStateChanged } from 'firebase/auth';

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

  React.useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
        setIsLoading(false);
        if (user) {
          toast({
            title: isSignUp ? 'Cadastro realizado!' : 'Login efetuado!',
            description: `Bem-vindo(a) de volta, ${user.email}!`,
          });
          router.push('/preferences');
        }
    }, (error) => {
        setIsLoading(false);
        const friendlyMessage =
          error.code === 'auth/invalid-credential'
            ? 'E-mail ou senha inválidos. Por favor, tente novamente.'
            : 'Ocorreu um erro. Por favor, tente novamente.';
        setAuthError(friendlyMessage);
        console.error('Auth Error:', error);
    });

    return () => unsubscribe();
  }, [auth, router, toast, isSignUp]);


  const onSubmit = (values: FormValues) => {
    setIsLoading(true);
    setAuthError(null);
    if (isSignUp) {
        if (!values.displayName) {
            form.setError('displayName', {message: "O nome é obrigatório"});
            setIsLoading(false);
            return;
        }
      signUpWithEmail(auth, firestore, values, values.displayName);
    } else {
      signInWithEmail(auth, values);
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
    <main className="flex min-h-screen w-full items-center justify-center bg-background p-4">
      <Card className="w-full max-w-sm">
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)}>
            <CardHeader>
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
                    <FormItem>
                      <FormLabel>Nome</FormLabel>
                      <FormControl>
                        <Input placeholder="Seu nome completo" {...field} />
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
                  <FormItem>
                    <FormLabel>Email</FormLabel>
                    <FormControl>
                      <Input
                        type="email"
                        placeholder="m@exemplo.com"
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
                  <FormItem>
                    <FormLabel>Senha</FormLabel>
                    <FormControl>
                      <Input type="password" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </CardContent>
            <CardFooter className="flex flex-col gap-4">
              {authError && <p className="text-sm text-destructive">{authError}</p>}
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
  );
}

    