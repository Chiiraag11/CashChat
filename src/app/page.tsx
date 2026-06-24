import { Github, Chrome, Zap, TrendingUp, MessageSquare, BarChart3 } from 'lucide-react';

const FEATURES = [
  { icon: MessageSquare, label: 'Natural language queries', desc: 'Ask questions in plain English, get instant answers from your data.' },
  { icon: BarChart3,    label: 'Visual analytics',         desc: 'Charts and tables auto-generated for every query.' },
  { icon: TrendingUp,   label: 'Spending trends',          desc: 'Track where your money goes across categories and time.' },
];

export default function LoginPage() {
  return (
    <div
      style={{
        minHeight: '100vh',
        background: 'var(--bg)',
        display: 'flex',
        overflow: 'hidden',
      }}
    >
      {/* LEFT: brand panel */}
      <div
        style={{
          flex: 1,
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'space-between',
          padding: '40px 48px',
          position: 'relative',
          borderRight: '1px solid var(--border)',
        }}
      >
        {/* Aurora — signature element, used ONLY here */}
        <div className="aurora" />

        {/* Grid bg */}
        <div
          className="grid-bg"
          style={{
            position: 'absolute',
            inset: 0,
            opacity: 0.4,
            pointerEvents: 'none',
          }}
        />

        {/* Content */}
        <div style={{ position: 'relative', zIndex: 1 }}>
          {/* Logo */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <div
              style={{
                width: '36px',
                height: '36px',
                borderRadius: '10px',
                background: 'linear-gradient(135deg, var(--emerald), #00A87A)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                boxShadow: '0 0 20px rgba(0,200,150,0.3)',
              }}
            >
              <Zap size={18} color="#fff" strokeWidth={2.5} />
            </div>
            <span
              style={{
                fontSize: '20px',
                fontWeight: '700',
                color: 'var(--text-1)',
                letterSpacing: '-0.02em',
              }}
            >
              FinChat
            </span>
          </div>
        </div>

        {/* Hero copy */}
        <div style={{ position: 'relative', zIndex: 1 }}>
          <p
            style={{
              fontSize: '11px',
              fontWeight: '600',
              color: 'var(--emerald)',
              letterSpacing: '0.1em',
              textTransform: 'uppercase',
              marginBottom: '16px',
            }}
          >
            Personal Finance AI
          </p>
          <h1
            style={{
              fontSize: '48px',
              fontWeight: '800',
              letterSpacing: '-0.04em',
              lineHeight: 1.05,
              color: 'var(--text-1)',
              marginBottom: '20px',
            }}
          >
            Ask your
            <br />
            <span className="gradient-text">money anything.</span>
          </h1>
          <p
            style={{
              fontSize: '15px',
              color: 'var(--text-2)',
              lineHeight: 1.6,
              maxWidth: '380px',
            }}
          >
            FinChat connects to your transactions and answers questions in plain English —
            no spreadsheets, no SQL, no guesswork.
          </p>

          {/* Features */}
          <div
            style={{
              display: 'flex',
              flexDirection: 'column',
              gap: '16px',
              marginTop: '40px',
            }}
          >
            {FEATURES.map(({ icon: Icon, label, desc }) => (
              <div key={label} style={{ display: 'flex', gap: '14px', alignItems: 'flex-start' }}>
                <div
                  style={{
                    width: '32px',
                    height: '32px',
                    borderRadius: '8px',
                    background: 'var(--emerald-dim, rgba(0,200,150,0.1))',
                    border: '1px solid rgba(0,200,150,0.15)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    flexShrink: 0,
                    marginTop: '2px',
                  }}
                >
                  <Icon size={15} color="var(--emerald)" strokeWidth={2} />
                </div>
                <div>
                  <div
                    style={{
                      fontSize: '13px',
                      fontWeight: '600',
                      color: 'var(--text-1)',
                      marginBottom: '2px',
                    }}
                  >
                    {label}
                  </div>
                  <div style={{ fontSize: '12px', color: 'var(--text-3)', lineHeight: 1.5 }}>
                    {desc}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Footer */}
        <div
          style={{
            position: 'relative',
            zIndex: 1,
            fontSize: '11px',
            color: 'var(--text-3)',
          }}
        >
          By continuing you agree this is a demo app — don't connect real financial accounts.
        </div>
      </div>

      {/* RIGHT: auth panel */}
      <div
        style={{
          width: '420px',
          flexShrink: 0,
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          padding: '48px 40px',
          background: 'var(--bg-subtle)',
        }}
      >
        <div style={{ width: '100%', maxWidth: '320px' }}>
          {/* Card */}
          <div
            style={{
              background: 'var(--surface)',
              border: '1px solid var(--border)',
              borderRadius: '16px',
              padding: '32px',
              boxShadow: 'var(--shadow-lg)',
            }}
          >
            <div style={{ marginBottom: '24px' }}>
              <h2
                style={{
                  fontSize: '20px',
                  fontWeight: '700',
                  color: 'var(--text-1)',
                  letterSpacing: '-0.02em',
                  marginBottom: '6px',
                }}
              >
                Sign in
              </h2>
              <p style={{ fontSize: '13px', color: 'var(--text-3)' }}>
                Connect your account to get started.
              </p>
            </div>

            {/* Auth buttons */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
              {/* Google */}
              <button
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: '10px',
                  width: '100%',
                  height: '42px',
                  borderRadius: '10px',
                  background: 'var(--surface-2)',
                  border: '1px solid var(--border)',
                  color: 'var(--text-1)',
                  fontSize: '13px',
                  fontWeight: '500',
                  cursor: 'pointer',
                  fontFamily: 'inherit',
                  transition: 'all 0.15s',
                }}
                onMouseEnter={(e) => {
                  (e.currentTarget as HTMLElement).style.borderColor = 'var(--border-strong)';
                  (e.currentTarget as HTMLElement).style.background = 'var(--surface-3)';
                }}
                onMouseLeave={(e) => {
                  (e.currentTarget as HTMLElement).style.borderColor = 'var(--border)';
                  (e.currentTarget as HTMLElement).style.background = 'var(--surface-2)';
                }}
              >
                <Chrome size={16} />
                Continue with Google
              </button>

              {/* Divider */}
              <div
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '10px',
                  margin: '4px 0',
                }}
              >
                <div style={{ flex: 1, height: '1px', background: 'var(--border)' }} />
                <span style={{ fontSize: '11px', color: 'var(--text-3)' }}>or</span>
                <div style={{ flex: 1, height: '1px', background: 'var(--border)' }} />
              </div>

              {/* GitHub */}
              <button
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: '10px',
                  width: '100%',
                  height: '42px',
                  borderRadius: '10px',
                  background: 'linear-gradient(135deg, var(--emerald), #00A87A)',
                  border: 'none',
                  color: '#fff',
                  fontSize: '13px',
                  fontWeight: '600',
                  cursor: 'pointer',
                  fontFamily: 'inherit',
                  transition: 'all 0.15s',
                  boxShadow: '0 2px 12px rgba(0,200,150,0.25)',
                }}
                onMouseEnter={(e) => {
                  (e.currentTarget as HTMLElement).style.opacity = '0.9';
                  (e.currentTarget as HTMLElement).style.transform = 'translateY(-1px)';
                  (e.currentTarget as HTMLElement).style.boxShadow = '0 4px 16px rgba(0,200,150,0.35)';
                }}
                onMouseLeave={(e) => {
                  (e.currentTarget as HTMLElement).style.opacity = '1';
                  (e.currentTarget as HTMLElement).style.transform = 'translateY(0)';
                  (e.currentTarget as HTMLElement).style.boxShadow = '0 2px 12px rgba(0,200,150,0.25)';
                }}
              >
                <Github size={16} />
                Continue with GitHub
              </button>
            </div>
          </div>

          {/* Reassurance */}
          <p
            style={{
              fontSize: '11px',
              color: 'var(--text-3)',
              textAlign: 'center',
              marginTop: '20px',
              lineHeight: 1.6,
            }}
          >
            Demo only. No real financial data is accessed or stored.
          </p>
        </div>
      </div>
    </div>
  );
}
