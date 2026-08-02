import { useEffect, useState, type FormEvent } from 'react';
import { useSearchParams } from 'react-router-dom';
import {
  getMePartner,
  updatePartnerPassword,
  updatePartnerProfile,
  type PartnerProfile,
} from '../api/partners';
import { IconShield } from '../components/Icons';
import PayoutMethodSection from '../components/PayoutMethodSection';
import W9Section from '../components/W9Section';

type SettingsTab = 'profile' | 'password' | 'w9' | 'payout';

const TABS: { id: SettingsTab; label: string }[] = [
  { id: 'profile', label: 'Profile' },
  { id: 'password', label: 'Password' },
  { id: 'w9', label: 'W-9' },
  { id: 'payout', label: 'Payout' },
];

function parseTab(value: string | null): SettingsTab {
  if (value === 'password' || value === 'w9' || value === 'payout') return value;
  return 'profile';
}

export default function SettingsPage() {
  const [searchParams, setSearchParams] = useSearchParams();
  const [activeTab, setActiveTab] = useState<SettingsTab>(() =>
    parseTab(searchParams.get('tab')),
  );
  const [profile, setProfile] = useState<PartnerProfile | null>(null);
  const [error, setError] = useState('');
  const [profileMsg, setProfileMsg] = useState('');
  const [passwordMsg, setPasswordMsg] = useState('');
  const [profileBusy, setProfileBusy] = useState(false);
  const [passwordBusy, setPasswordBusy] = useState(false);

  async function loadProfile() {
    const data = await getMePartner();
    setProfile(data);
    return data;
  }

  useEffect(() => {
    loadProfile().catch((err) =>
      setError(err instanceof Error ? err.message : 'Failed to load settings'),
    );
  }, []);

  useEffect(() => {
    const tab = parseTab(searchParams.get('tab'));
    setActiveTab(tab);
  }, [searchParams]);

  function selectTab(tab: SettingsTab) {
    setActiveTab(tab);
    setSearchParams(tab === 'profile' ? {} : { tab }, { replace: true });
  }

  async function onProfileSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setProfileMsg('');
    setProfileBusy(true);
    const fd = new FormData(e.currentTarget);
    try {
      const updated = await updatePartnerProfile({
        fullName: String(fd.get('fullName') || ''),
        companyName: String(fd.get('companyName') || ''),
        website: String(fd.get('website') || ''),
      });
      setProfile(updated);
      setProfileMsg('Profile updated.');
    } catch (err) {
      setProfileMsg(err instanceof Error ? err.message : 'Update failed');
    } finally {
      setProfileBusy(false);
    }
  }

  async function onPasswordSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setPasswordMsg('');
    const fd = new FormData(e.currentTarget);
    const newPassword = String(fd.get('newPassword') || '');
    const confirmPassword = String(fd.get('confirmPassword') || '');
    if (newPassword !== confirmPassword) {
      setPasswordMsg('New passwords do not match.');
      return;
    }
    setPasswordBusy(true);
    try {
      await updatePartnerPassword({
        currentPassword: String(fd.get('currentPassword') || ''),
        newPassword,
      });
      setPasswordMsg('Password updated.');
      e.currentTarget.reset();
    } catch (err) {
      setPasswordMsg(err instanceof Error ? err.message : 'Update failed');
    } finally {
      setPasswordBusy(false);
    }
  }

  if (error && !profile) {
    return (
      <main className="shell settings-page">
        <p className="error">{error}</p>
      </main>
    );
  }

  if (!profile) {
    return (
      <main className="shell settings-page">
        <div className="loading-state" role="status">
          <div className="loading-spinner" aria-hidden />
          Loading settings…
        </div>
      </main>
    );
  }

  const tabPanelId = (tab: SettingsTab) => `settings-panel-${tab}`;

  return (
    <main className="shell settings-page">
      <div className="settings-header">
        <h1>Settings</h1>
        <p className="muted">Manage your account, tax form, and payout details.</p>
      </div>

      <div
        className="settings-tabs"
        role="tablist"
        aria-label="Settings sections"
      >
        {TABS.map((tab) => (
          <button
            key={tab.id}
            type="button"
            role="tab"
            id={`settings-tab-${tab.id}`}
            className={`settings-tab ${activeTab === tab.id ? 'active' : ''}`}
            aria-selected={activeTab === tab.id}
            aria-controls={tabPanelId(tab.id)}
            onClick={() => selectTab(tab.id)}
          >
            {tab.label}
            {tab.id === 'w9' && !profile.w9Submitted ? (
              <span className="settings-tab-dot" aria-label="Action required" />
            ) : null}
          </button>
        ))}
      </div>

      <div className="settings-panels">
        {activeTab === 'profile' ? (
          <section
            className="card settings-section"
            role="tabpanel"
            id={tabPanelId('profile')}
            aria-labelledby="settings-tab-profile"
          >
            <div className="card-head">
              <div>
                <h3>Personal information</h3>
                <p className="card-desc">Your partner profile details</p>
              </div>
            </div>
            <form className="form" onSubmit={onProfileSubmit}>
              <label>
                Email
                <input name="email" type="email" value={profile.email} disabled />
              </label>
              <label>
                Full name
                <input
                  name="fullName"
                  type="text"
                  required
                  defaultValue={profile.fullName || ''}
                />
              </label>
              <label>
                Company name
                <input
                  name="companyName"
                  type="text"
                  defaultValue={profile.companyName || ''}
                />
              </label>
              <label>
                Website
                <input
                  name="website"
                  type="url"
                  placeholder="https://example.com"
                  defaultValue={profile.website || ''}
                />
              </label>
              <p className="muted" style={{ fontSize: '0.82rem' }}>
                Partner code <code>{profile.code}</code> · status{' '}
                <span className={`badge ${profile.status}`}>{profile.status}</span>
              </p>
              {profileMsg ? (
                <p className={profileMsg.includes('updated') ? 'success' : 'error'}>
                  {profileMsg}
                </p>
              ) : null}
              <button type="submit" className="btn btn-primary" disabled={profileBusy}>
                {profileBusy ? 'Saving…' : 'Save profile'}
              </button>
            </form>
          </section>
        ) : null}

        {activeTab === 'password' ? (
          <section
            className="card settings-section"
            role="tabpanel"
            id={tabPanelId('password')}
            aria-labelledby="settings-tab-password"
          >
            <div className="card-head">
              <div>
                <h3>Change password</h3>
                <p className="card-desc">Update your sign-in password</p>
              </div>
              <IconShield className="card-head-icon" />
            </div>
            <form className="form" onSubmit={onPasswordSubmit}>
              <label>
                Current password
                <input
                  name="currentPassword"
                  type="password"
                  required
                  autoComplete="current-password"
                />
              </label>
              <label>
                New password
                <input
                  name="newPassword"
                  type="password"
                  required
                  minLength={8}
                  autoComplete="new-password"
                />
              </label>
              <label>
                Confirm new password
                <input
                  name="confirmPassword"
                  type="password"
                  required
                  minLength={8}
                  autoComplete="new-password"
                />
              </label>
              {passwordMsg ? (
                <p className={passwordMsg.includes('updated') ? 'success' : 'error'}>
                  {passwordMsg}
                </p>
              ) : null}
              <button type="submit" className="btn btn-primary" disabled={passwordBusy}>
                {passwordBusy ? 'Updating…' : 'Update password'}
              </button>
            </form>
          </section>
        ) : null}

        {activeTab === 'w9' ? (
          <div
            role="tabpanel"
            id={tabPanelId('w9')}
            aria-labelledby="settings-tab-w9"
          >
            <W9Section
              w9Submitted={profile.w9Submitted}
              w9SubmittedAt={profile.w9SubmittedAt}
              w9Summary={profile.w9Summary}
              onSubmitted={async () => {
                await loadProfile();
              }}
            />
          </div>
        ) : null}

        {activeTab === 'payout' ? (
          <div
            role="tabpanel"
            id={tabPanelId('payout')}
            aria-labelledby="settings-tab-payout"
          >
            <PayoutMethodSection
              payoutDetails={profile.payoutDetails}
              onSaved={async () => {
                await loadProfile();
              }}
            />
          </div>
        ) : null}
      </div>
    </main>
  );
}
