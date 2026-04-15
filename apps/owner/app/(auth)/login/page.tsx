import { Logo } from '@/components/ui/logo';
import { LoginForm } from './components/login-form';

export default function LoginPage() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-cream p-4">
      <div className="w-full max-w-sm rounded-sm border border-border bg-white p-12">
        <div className="mb-8 flex flex-col items-center">
          <Logo width={140} />
          <p className="mt-3 text-xs text-muted">Gestione Stalla</p>
        </div>
        <LoginForm />
      </div>
    </div>
  );
}
