import { useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { ArrowLeft, UserPlus, Users, Settings, Mail, CheckCircle2 } from 'lucide-react';

const MOCK_COLLABS = [
  { _id: 'u1', name: 'Alice', email: 'alice@example.com', role: 'owner' },
  { _id: 'u2', name: 'Bob', email: 'bob@example.com', role: 'editor' },
];

const Collaborators = () => {
  const { id } = useParams();
  const [collaborators] = useState(MOCK_COLLABS);
  const [inviteEmail, setInviteEmail] = useState('');
  const [inviteSent, setInviteSent] = useState(false);

  const handleInvite = (e) => {
    e.preventDefault();
    if(inviteEmail.trim()) {
      setInviteSent(true);
      setInviteEmail('');
      setTimeout(() => setInviteSent(false), 3000);
    }
  };

  return (
    <div className="max-w-4xl mx-auto px-4 py-8">
      <Link to={`/trips/${id}`} className="text-gray-500 hover:text-brand-dark flex items-center gap-2 mb-6">
        <ArrowLeft size={16} /> Back to Trip Detail
      </Link>
      
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
        <div>
          <h1 className="text-3xl font-bold text-brand-dark flex items-center gap-2">
            <Users className="text-brand-blue" /> Manage Collaborators
          </h1>
          <p className="text-gray-500 mt-1">Invite friends to plan the trip together.</p>
        </div>
      </div>

      <div className="grid md:grid-cols-3 gap-8">
        {/* Invite section */}
        <div className="md:col-span-1">
          <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 sticky top-6">
            <h3 className="text-lg font-bold text-brand-dark mb-4 flex items-center gap-2">
              <UserPlus size={18} className="text-brand-blue" />
              Invite New
            </h3>
            <form onSubmit={handleInvite}>
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 mb-1">Email address</label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <Mail className="h-4 w-4 text-gray-400" />
                  </div>
                  <input
                    type="email"
                    required
                    value={inviteEmail}
                    onChange={(e) => setInviteEmail(e.target.value)}
                    className="pl-9 block w-full border border-gray-200 rounded-xl py-2 focus:ring-brand-blue focus:border-brand-blue sm:text-sm text-gray-900"
                    placeholder="friend@example.com"
                  />
                </div>
              </div>
              <button
                type="submit"
                className="w-full bg-brand-blue text-white py-2.5 rounded-xl font-medium hover:bg-blue-600 transition-colors shadow-sm"
              >
                Send Invite
              </button>
            </form>

            {inviteSent && (
              <div className="mt-4 p-3 bg-green-50 rounded-xl text-green-700 text-sm font-medium flex items-center gap-2">
                <CheckCircle2 size={16} /> Invite sent successfully!
              </div>
            )}
          </div>
        </div>

        {/* List of collaborators */}
        <div className="md:col-span-2">
          <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
            <div className="px-6 py-4 border-b border-gray-100 bg-gray-50 flex items-center justify-between">
              <h3 className="font-bold text-brand-dark">Current Members</h3>
              <span className="text-xs font-semibold text-gray-500 bg-gray-200 px-2.5 py-1 rounded-full">
                {collaborators.length} members
              </span>
            </div>
            <ul className="divide-y divide-gray-100">
              {collaborators.map(user => (
                <li key={user._id} className="p-6 flex items-center justify-between hover:bg-gray-50 transition-colors">
                  <div className="flex items-center gap-4">
                    <div className="w-10 h-10 rounded-full bg-brand-blue text-white flex items-center justify-center font-bold text-lg shadow-sm">
                      {user.name.charAt(0)}
                    </div>
                    <div>
                      <div className="font-bold text-brand-dark">{user.name}</div>
                      <div className="text-sm text-gray-500">{user.email}</div>
                    </div>
                  </div>
                  <div className="flex items-center gap-4">
                    <span className={`px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider ${
                      user.role === 'owner' ? 'bg-purple-100 text-purple-700' : 'bg-blue-100 text-brand-blue'
                    }`}>
                      {user.role}
                    </span>
                    {user.role !== 'owner' && (
                      <button className="text-gray-400 hover:text-gray-600 p-1">
                        <Settings size={18} />
                      </button>
                    )}
                  </div>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Collaborators;
