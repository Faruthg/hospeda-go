import React, { useState } from 'react';
import { Building2, KeyRound, LockKeyhole, LogIn, UserPlus, X } from 'lucide-react';
import { DemoAccount, UserRole } from '../types';
import { DEMO_ACCOUNTS } from '../data/demoAccounts';

interface AuthModalProps {
  initialMode: 'login' | 'register';
  accounts: DemoAccount[];
  onClose: () => void;
  onSuccess: (account: DemoAccount, isNewAccount: boolean) => boolean;
  onChangePassword: (email: string, password: string) => DemoAccount | null;
}

export const AuthModal: React.FC<AuthModalProps> = ({
  initialMode,
  accounts,
  onClose,
  onSuccess,
  onChangePassword
}) => {
  const [mode, setMode] = useState<'login' | 'register' | 'changePassword'>(initialMode);
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [role, setRole] = useState<Exclude<UserRole, 'admin'>>('guest');
  const [resetAccount, setResetAccount] = useState<DemoAccount | null>(null);
  const [error, setError] = useState('');

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setError('');
    const normalizedEmail = email.trim().toLowerCase();

    if (mode === 'login') {
      const account = accounts.find(candidate =>
        candidate.email.toLowerCase() === normalizedEmail && candidate.password === password
      );
      if (!account) {
        setError('Correo o contraseña incorrectos.');
        return;
      }
      if (account.mustChangePassword) {
        setResetAccount(account);
        setPassword('');
        setConfirmPassword('');
        setMode('changePassword');
        return;
      }
      if (!onSuccess(account, false)) {
        setError('Para continuar con esta reserva necesitas una cuenta de huésped.');
      }
      return;
    }

    if (mode === 'changePassword') {
      if (!resetAccount) {
        setError('Vuelve a iniciar sesión con la contraseña temporal.');
        setMode('login');
        return;
      }
      if (password.length < 8) {
        setError('La nueva contraseña debe tener al menos 8 caracteres.');
        return;
      }
      if (password === resetAccount.password) {
        setError('La nueva contraseña debe ser diferente a la temporal.');
        return;
      }
      if (password !== confirmPassword) {
        setError('Las contraseñas no coinciden.');
        return;
      }

      const updatedAccount = onChangePassword(resetAccount.email, password);
      if (!updatedAccount) {
        setError('No se pudo actualizar la contraseña. Inicia sesión de nuevo.');
        return;
      }
      if (!onSuccess(updatedAccount, false)) {
        setError('Para continuar con esta reserva necesitas una cuenta de huésped.');
      }
      return;
    }

    if (!name.trim()) {
      setError('Escribe tu nombre para crear la cuenta.');
      return;
    }
    if (password.length < 8) {
      setError('La contraseña debe tener al menos 8 caracteres.');
      return;
    }
    if (password !== confirmPassword) {
      setError('Las contraseñas no coinciden.');
      return;
    }
    if (accounts.some(account => account.email.toLowerCase() === normalizedEmail)) {
      setError('Ya existe una cuenta con ese correo. Inicia sesión.');
      return;
    }

    const created = onSuccess({
      name: name.trim(),
      email: normalizedEmail,
      password,
      role
    }, true);
    if (!created) setError('Para continuar con esta reserva necesitas registrarte como huésped.');
  };

  const changeMode = (nextMode: 'login' | 'register') => {
    setMode(nextMode);
    setResetAccount(null);
    setError('');
  };

  return (
    <div className="fixed inset-0 z-[70] bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
      <div className="bg-white dark:bg-slate-900 w-full max-w-md rounded-3xl shadow-2xl border border-slate-200 dark:border-slate-800 overflow-hidden">
        <div className="p-6 sm:p-7">
          <div className="flex items-start justify-between gap-4">
            <div>
              <div className="w-11 h-11 rounded-2xl bg-emerald-100 dark:bg-emerald-950 text-emerald-700 dark:text-emerald-300 flex items-center justify-center mb-4">
                <Building2 className="w-5 h-5" />
              </div>
              <h2 className="text-xl font-extrabold text-slate-900 dark:text-white">
                {mode === 'login'
                  ? 'Inicia sesión'
                  : mode === 'register'
                    ? 'Crea tu cuenta'
                    : 'Cambia tu contraseña'}
              </h2>
              <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">
                {mode === 'login'
                  ? 'Accede al espacio correspondiente a tu tipo de cuenta.'
                  : mode === 'register'
                    ? 'Regístrate para confirmar y consultar tus reservas.'
                    : 'La contraseña temporal ya fue validada. Define una contraseña nueva para continuar.'}
              </p>
            </div>
            <button onClick={onClose} className="p-2 text-slate-400 hover:text-slate-700 dark:hover:text-white" aria-label="Cerrar">
              <X className="w-5 h-5" />
            </button>
          </div>

          {mode !== 'changePassword' && (
            <div className="flex p-1 bg-slate-100 dark:bg-slate-800 rounded-xl mt-5 text-sm font-bold">
              <button
                onClick={() => changeMode('login')}
                className={`flex-1 py-2 rounded-lg ${mode === 'login' ? 'bg-white dark:bg-slate-900 text-slate-900 dark:text-white shadow-sm' : 'text-slate-500'}`}
              >
                Ingresar
              </button>
              <button
                onClick={() => changeMode('register')}
                className={`flex-1 py-2 rounded-lg ${mode === 'register' ? 'bg-white dark:bg-slate-900 text-slate-900 dark:text-white shadow-sm' : 'text-slate-500'}`}
              >
                Registrarme
              </button>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-3 mt-5">
            {mode === 'register' && (
              <>
                <label className="block text-xs font-bold text-slate-600 dark:text-slate-300">
                  Nombre
                  <input
                    value={name}
                    onChange={event => setName(event.target.value)}
                    autoComplete="name"
                    className="mt-1.5 w-full rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 px-3 py-2.5 text-sm font-normal text-slate-900 dark:text-white outline-none focus:ring-2 focus:ring-emerald-500"
                    required
                  />
                </label>
                <label className="block text-xs font-bold text-slate-600 dark:text-slate-300">
                  Tipo de cuenta
                  <select
                    value={role}
                    onChange={event => setRole(event.target.value as Exclude<UserRole, 'admin'>)}
                    className="mt-1.5 w-full rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 px-3 py-2.5 text-sm font-normal text-slate-900 dark:text-white outline-none focus:ring-2 focus:ring-emerald-500"
                  >
                    <option value="guest">Huésped</option>
                    <option value="host">Anfitrión</option>
                  </select>
                </label>
              </>
            )}
            <label className="block text-xs font-bold text-slate-600 dark:text-slate-300">
              Correo electrónico
              <input
                type="email"
                value={email}
                onChange={event => setEmail(event.target.value)}
                autoComplete="email"
                className="mt-1.5 w-full rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 px-3 py-2.5 text-sm font-normal text-slate-900 dark:text-white outline-none focus:ring-2 focus:ring-emerald-500"
                required
              />
            </label>
            <label className="block text-xs font-bold text-slate-600 dark:text-slate-300">
              {mode === 'changePassword' ? 'Nueva contraseña' : 'Contraseña'}
              <input
                type="password"
                value={password}
                onChange={event => setPassword(event.target.value)}
                autoComplete={mode === 'login' ? 'current-password' : 'new-password'}
                className="mt-1.5 w-full rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 px-3 py-2.5 text-sm font-normal text-slate-900 dark:text-white outline-none focus:ring-2 focus:ring-emerald-500"
                required
              />
            </label>
            {mode !== 'login' && (
              <label className="block text-xs font-bold text-slate-600 dark:text-slate-300">
                Confirmar contraseña
                <input
                  type="password"
                  value={confirmPassword}
                  onChange={event => setConfirmPassword(event.target.value)}
                  autoComplete="new-password"
                  className="mt-1.5 w-full rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 px-3 py-2.5 text-sm font-normal text-slate-900 dark:text-white outline-none focus:ring-2 focus:ring-emerald-500"
                  required
                />
              </label>
            )}

            {error && <p role="alert" className="text-xs font-semibold text-rose-600">{error}</p>}

            <button
              type="submit"
              className="w-full flex items-center justify-center gap-2 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-sm py-3 transition-colors"
            >
              {mode === 'login'
                ? <LogIn className="w-4 h-4" />
                : mode === 'register'
                  ? <UserPlus className="w-4 h-4" />
                  : <KeyRound className="w-4 h-4" />}
              {mode === 'login' ? 'Ingresar' : mode === 'register' ? 'Crear cuenta' : 'Guardar nueva contraseña'}
            </button>
          </form>

          {mode !== 'changePassword' && (
            <div className="mt-5 rounded-2xl bg-slate-50 dark:bg-slate-800/70 border border-slate-200 dark:border-slate-700 p-3.5">
              <div className="flex items-center gap-2 text-xs font-bold text-slate-700 dark:text-slate-200">
                <LockKeyhole className="w-3.5 h-3.5 text-emerald-600" />
                Cuentas de prueba
              </div>
              <div className="grid gap-1 mt-2 text-[11px] text-slate-600 dark:text-slate-300">
                {DEMO_ACCOUNTS.map(demoAccount => {
                  const currentAccount = accounts.find(account => account.email === demoAccount.email);
                  const credentialLabel = currentAccount?.mustChangePassword
                    ? 'Clave temporal entregada por el administrador'
                    : currentAccount?.password === demoAccount.password
                      ? demoAccount.password
                      : 'Contraseña modificada en este navegador';
                  return (
                    <div key={demoAccount.email} className="flex flex-wrap justify-between gap-x-3">
                      <span>{demoAccount.role === 'admin' ? 'Administrador' : demoAccount.role === 'host' ? 'Anfitrión' : 'Huésped'}</span>
                      <span className="font-mono">{demoAccount.email} · {credentialLabel}</span>
                    </div>
                  );
                })}
              </div>
              <p className="text-[10px] leading-relaxed text-amber-700 dark:text-amber-300 mt-2">
                Prototipo local: las cuentas y contraseñas se guardan en este navegador. No uses datos reales; no es autenticación segura para producción.
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
