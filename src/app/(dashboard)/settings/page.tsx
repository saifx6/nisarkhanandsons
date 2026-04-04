'use client';

import { useState } from 'react';
import { Settings, User, Bell, Palette, Shield } from 'lucide-react';
import { Button } from '@/components/ui/button';

export default function SettingsPage() {
  const [activeTab, setActiveTab] = useState('profile');

  const tabs = [
    { id: 'profile', label: 'Profile settings', icon: User },
    { id: 'notifications', label: 'Notifications', icon: Bell },
    { id: 'appearance', label: 'Appearance', icon: Palette },
    { id: 'security', label: 'Security', icon: Shield },
  ];

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-3xl font-heading font-bold text-text-primary tracking-wide">Settings</h2>
        <p className="text-text-secondary mt-1">Manage system configurations and personal preferences.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="space-y-2">
          {tabs.map((tab) => {
            const Icon = tab.icon;
            const isActive = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`w-full flex items-center justify-between p-4 bg-bg-surface border rounded-lg text-left transition-colors ${
                  isActive 
                    ? 'border-accent-primary/50 bg-bg-hover' 
                    : 'border-border hover:bg-bg-hover'
                }`}
              >
                <div className="flex items-center gap-3">
                  <Icon className={isActive ? 'text-accent-primary' : 'text-text-muted'} size={20} />
                  <div className={`font-medium ${isActive ? 'text-text-primary' : 'text-text-secondary'}`}>
                    {tab.label}
                  </div>
                </div>
              </button>
            );
          })}
        </div>

        <div className="md:col-span-2 bg-bg-surface border border-border rounded-lg p-6 shadow-sm min-h-[400px]">
          {activeTab === 'profile' && (
            <div>
              <h3 className="text-xl font-heading font-bold text-text-primary mb-4 border-b border-border pb-2">Profile Information</h3>
              <div className="space-y-4 max-w-md">
                <div>
                  <label className="block text-sm font-medium text-text-secondary mb-1">Full Name</label>
                  <input 
                    type="text" 
                    defaultValue="Admin User" 
                    disabled
                    className="w-full bg-bg-app border border-border rounded-md p-2 text-text-primary focus:outline-none focus:border-accent-primary opacity-70"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-text-secondary mb-1">Email Address</label>
                  <input 
                    type="email" 
                    defaultValue="admin@nisarkhan.com" 
                    disabled
                    className="w-full bg-bg-app border border-border rounded-md p-2 text-text-primary focus:outline-none focus:border-accent-primary opacity-70"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-text-secondary mb-1">Role</label>
                  <input 
                    type="text" 
                    defaultValue="Administrator" 
                    disabled
                    className="w-full bg-bg-app border border-border rounded-md p-2 text-text-primary focus:outline-none focus:border-accent-primary opacity-70"
                  />
                </div>
                <div className="pt-4 border-t border-border">
                  <Button disabled className="bg-bg-hover text-text-muted cursor-not-allowed">
                    Save Changes
                  </Button>
                  <p className="text-xs text-text-muted mt-2 mt-4">
                    Profile updating functionality will be available in a future update.
                  </p>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'notifications' && (
            <div>
              <h3 className="text-xl font-heading font-bold text-text-primary mb-4 border-b border-border pb-2">Notifications</h3>
              <div className="space-y-4 max-w-md">
                <p className="text-text-secondary text-sm mb-4">Manage how you receive alerts and updates.</p>
                
                <div className="flex items-center justify-between py-2 border-b border-border/50">
                  <div>
                    <div className="font-medium text-text-primary">Email Notifications</div>
                    <div className="text-xs text-text-muted">Receive daily summary reports via email</div>
                  </div>
                  <div className="w-10 h-5 bg-accent-primary/20 rounded-full relative cursor-not-allowed opacity-60">
                    <div className="w-4 h-4 bg-accent-primary rounded-full absolute right-1 top-0.5"></div>
                  </div>
                </div>

                <div className="flex items-center justify-between py-2 border-b border-border/50">
                  <div>
                    <div className="font-medium text-text-primary">Low Stock Alerts</div>
                    <div className="text-xs text-text-muted">Get notified when tile inventory is low</div>
                  </div>
                  <div className="w-10 h-5 bg-accent-primary/20 rounded-full relative cursor-not-allowed opacity-60">
                    <div className="w-4 h-4 bg-accent-primary rounded-full absolute right-1 top-0.5"></div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'appearance' && (
            <div>
              <h3 className="text-xl font-heading font-bold text-text-primary mb-4 border-b border-border pb-2">Appearance</h3>
              <div className="space-y-4 max-w-md">
                <p className="text-text-secondary text-sm mb-4">Customize the look and feel of the management dashboard.</p>
                
                <div className="grid grid-cols-2 gap-4">
                  <div className="border border-accent-primary rounded-lg p-4 bg-bg-app cursor-pointer relative overflow-hidden">
                    <div className="absolute top-2 right-2 w-3 h-3 bg-accent-primary rounded-full"></div>
                    <div className="w-full h-16 bg-bg-surface rounded mb-2 border border-border flex items-center justify-center">
                      <div className="w-8 h-8 rounded-full bg-accent-primary/20 flex items-center justify-center">
                        <div className="w-4 h-4 bg-accent-primary rounded-full"></div>
                      </div>
                    </div>
                    <div className="text-center font-medium text-text-primary">Dark Theme</div>
                  </div>
                  
                  <div className="border border-border hover:border-text-muted rounded-lg p-4 bg-[#f8f9fa] cursor-not-allowed opacity-50 relative overflow-hidden">
                    <div className="w-full h-16 bg-white rounded mb-2 border border-[#e5e7eb] flex items-center justify-center">
                      <div className="w-8 h-8 rounded-full bg-blue-100 flex items-center justify-center">
                        <div className="w-4 h-4 bg-blue-500 rounded-full"></div>
                      </div>
                    </div>
                    <div className="text-center font-medium text-black">Light Theme</div>
                    <div className="absolute inset-0 bg-black/5 flex flex-col items-center justify-center backdrop-blur-[1px]">
                      <span className="text-xs font-bold text-black uppercase tracking-widest bg-white/80 px-2 rounded">Coming Soon</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'security' && (
            <div>
              <h3 className="text-xl font-heading font-bold text-text-primary mb-4 border-b border-border pb-2">Security</h3>
              <div className="space-y-4 max-w-md">
                <p className="text-text-secondary text-sm mb-4">Manage your password and account security settings.</p>
                
                <div>
                  <label className="block text-sm font-medium text-text-secondary mb-1">Current Password</label>
                  <input 
                    type="password" 
                    placeholder="••••••••" 
                    disabled
                    className="w-full bg-bg-app border border-border rounded-md p-2 text-text-primary focus:outline-none cursor-not-allowed opacity-70"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-text-secondary mb-1">New Password</label>
                  <input 
                    type="password" 
                    placeholder="New password" 
                    disabled
                    className="w-full bg-bg-app border border-border rounded-md p-2 text-text-primary focus:outline-none cursor-not-allowed opacity-70"
                  />
                </div>
                
                <div className="pt-4 border-t border-border mt-6">
                  <Button disabled className="bg-bg-hover text-text-muted cursor-not-allowed">
                    Update Password
                  </Button>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
