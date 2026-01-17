
import React from 'react';
import Button from './ui/Button';
import Input from './ui/Input';
import Badge from './ui/Badge';
import Avatar from './ui/Avatar';
import Card from './ui/Card';
import Alert from './ui/Alert';
import ChatMessage from './ui/ChatMessage';
import AddFriendCard from './ui/AddFriendCard';
import Checkbox from './ui/Checkbox';
import Switch from './ui/Switch';
import Select from './ui/Select';
import Textarea from './ui/Textarea';
import Separator from './ui/Separator';
import Skeleton from './ui/Skeleton';
import Ticker from './ui/Ticker';
import CryptoHover from './ui/CryptoHover';
import Nav from './ui/Nav';


const ComponentSection = ({ title, children }: { title: string, children: React.ReactNode }) => (
    <div className="mb-12 border-2 border-dashed border-grunge-gray/30 p-8">
        <h2 className="text-2xl font-display uppercase mb-6 text-grunge-dark border-b-4 border-grunge-accent inline-block">{title}</h2>
        <div className="flex flex-wrap gap-8 items-start">
            {children}
        </div>
    </div>
);

const ComponentsPage = () => {
    return (
        <div className="min-h-screen bg-grunge-light">
            <Nav />
            <div className="p-10 pb-20">
                <div className="max-w-6xl mx-auto">

                    <header className="mb-16 text-center">
                        <h1 className="text-5xl font-display uppercase tracking-tighter mb-4">UI Manifesto</h1>
                        <p className="font-mono text-grunge-gray text-lg">A collection of brutalist components used across the system.</p>
                    </header>

                    <ComponentSection title="Buttons">
                        <div className="flex flex-col gap-4">
                            <div className="flex items-center gap-4">
                                <Button variant="primary">Primary</Button>
                                <Button variant="outline">Outline</Button>
                                <Button variant="ghost">Ghost</Button>
                            </div>
                            <div className="flex items-center gap-4">
                                <Button variant="primary" className="bg-grunge-green text-grunge-dark">Custom</Button>
                                <Button variant="primary" disabled>Disabled</Button>
                            </div>
                        </div>
                    </ComponentSection>

                    <ComponentSection title="Typography / Badges">
                        <div className="flex items-center gap-4">
                            <Badge variant="default">Default</Badge>
                            <Badge variant="accent">Accent</Badge>
                            <Badge variant="outline">Outline</Badge>
                            <Badge variant="accent" animate>Animated</Badge>
                            <CryptoHover text="HOVER ME" className="font-mono font-bold text-xl" activeClassName="text-grunge-accent" />
                        </div>
                    </ComponentSection>

                    <ComponentSection title="Inputs & Controls">
                        <div className="flex flex-col gap-6 w-full max-w-md">
                            <Input label="Username" placeholder="Enter username..." error="" />
                            <Input label="Email" type="email" placeholder="Enter email..." error="Invalid email address" />

                            <div className="flex items-center gap-8">
                                <Checkbox label="Remember me" checked={false} onChange={() => { }} disabled={false} />
                                <Checkbox label="Checked" checked={true} onChange={() => { }} disabled={false} />
                                <Switch label="Notifications" checked={false} onChange={() => { }} disabled={false} />
                                <Switch label="Active" checked={true} onChange={() => { }} disabled={false} />
                            </div>

                            <Select
                                label="Role"
                                error=""
                                options={[
                                    { value: 'user', label: 'User' },
                                    { value: 'admin', label: 'Admin' },
                                    { value: 'mod', label: 'Moderator' }
                                ]}
                            />

                            <Textarea label="Bio" placeholder="Tell us about yourself..." error="" />
                        </div>
                    </ComponentSection>

                    <ComponentSection title="Avatars">
                        <div className="flex items-center gap-6">
                            <Avatar fallback="SM" size="sm" src="" alt="sm" />
                            <Avatar fallback="MD" size="md" src="" alt="md" />
                            <Avatar fallback="LG" size="lg" src="" alt="lg" />
                            <Avatar src="https://api.dicebear.com/7.x/avataaars/svg?seed=Felix" fallback="FX" size="md" alt="Felix" />
                        </div>
                    </ComponentSection>

                    <ComponentSection title="Cards">
                        <Card className="p-6 w-64">
                            <h3 className="font-display text-xl mb-2">Basic Card</h3>
                            <p className="font-mono text-sm">Simple container.</p>
                        </Card>

                        <Card className="p-6 w-64" hoverEffect>
                            <h3 className="font-display text-xl mb-2">Hover Card</h3>
                            <p className="font-mono text-sm">Lifts on hover.</p>
                        </Card>
                    </ComponentSection>

                    <ComponentSection title="Messaging">
                        <div className="flex flex-col gap-4 w-full max-w-xl">
                            <ChatMessage
                                sender="Alice"
                                time="12:30 PM"
                                message="Hey! check out this new UI library."
                                avatarFallback="AL"
                            />
                            <ChatMessage
                                sender="You"
                                time="12:31 PM"
                                message="Looks sick! love the brutalist vibes."
                                avatarFallback="ME"
                                isOwn
                            />
                        </div>
                    </ComponentSection>

                    <ComponentSection title="Complex Modules">
                        <AddFriendCard
                            username="johndoe"
                            avatarUrl="https://api.dicebear.com/7.x/avataaars/svg?seed=John"
                            bio="Frontend Wizard"
                        />
                        <AddFriendCard
                            username="janedoe"
                            avatarUrl=""
                            bio="Backend Ninja"
                            isPending
                        />
                    </ComponentSection>

                    <ComponentSection title="Feedback">
                        <div className="flex flex-col gap-4 w-full max-w-md">
                            <Alert title="Details" variant="default">
                                System update scheduled for tonight.
                            </Alert>
                            <Alert title="Success!" variant="success">
                                Profile updated successfully!
                            </Alert>
                            <Alert title="Error" variant="destructive">
                                Failed to connect to server.
                            </Alert>
                        </div>
                    </ComponentSection>

                    <ComponentSection title="Misc">
                        <div className="flex flex-col gap-8 w-full">
                            <div className="w-full">
                                <p className="font-mono mb-2 text-xs uppercase">Separator</p>
                                <Separator />
                            </div>

                            <div className="w-full">
                                <p className="font-mono mb-2 text-xs uppercase">Skeleton</p>
                                <div className="flex gap-4">
                                    <Skeleton className="w-12 h-12 rounded-full" />
                                    <div className="flex-1 space-y-2">
                                        <Skeleton className="h-4 w-full" />
                                        <Skeleton className="h-4 w-3/4" />
                                    </div>
                                </div>
                            </div>

                            <div className="w-full overflow-hidden border-2 border-grunge-dark">
                                <Ticker />
                            </div>
                        </div>
                    </ComponentSection>
                </div>
            </div>
        </div>
    );
};

export default ComponentsPage;
