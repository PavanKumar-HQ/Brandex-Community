import React, { useEffect, useState } from 'react';
import { Shield, Plus, Edit2, Archive, CheckCircle, RefreshCw, Layers, FileText, Image as ImageIcon, Video, Award, BookOpen, AlertCircle, BarChart3, Activity, Calendar } from 'lucide-react';
import {
  getAllEventsAdmin,
  getAllTrainingProgramsAdmin,
  getAllPhotosAdmin,
  getAllVideosAdmin,
  getAllCommunitiesAdmin,
  getAllStoriesAdmin,
  getAllAchievementsAdmin,
  getAllAnnouncementsAdmin,
  getAllStatisticsAdmin,
  getAuditLogs,
  createEvent,
  updateEvent,
  archiveEvent,
  createCommunity,
  updateCommunity,
  archiveCommunity,
  createPhoto,
  archivePhoto,
  createVideo,
  archiveVideo,
  createStory,
  archiveStory,
  createAchievement,
  archiveAchievement,
  createAnnouncement,
  archiveAnnouncement,
  updateStatistic
} from '../repositories/repository';
import { Event, TrainingProgram, Photo, YouTubeVideo, Community, Story, Achievement, Announcement, Statistic, AuditLog } from '../models/types';

export const AdminDashboardPage: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'dashboard' | 'events' | 'communities' | 'photos' | 'videos' | 'training' | 'stories' | 'achievements' | 'announcements' | 'statistics' | 'audit'>('dashboard');

  const [events, setEvents] = useState<Event[]>([]);
  const [communities, setCommunities] = useState<Community[]>([]);
  const [photos, setPhotos] = useState<Photo[]>([]);
  const [videos, setVideos] = useState<YouTubeVideo[]>([]);
  const [trainingList, setTrainingList] = useState<TrainingProgram[]>([]);
  const [stories, setStories] = useState<Story[]>([]);
  const [achievements, setAchievements] = useState<Achievement[]>([]);
  const [announcements, setAnnouncements] = useState<Announcement[]>([]);
  const [statistics, setStatistics] = useState<Statistic[]>([]);
  const [auditLogs, setAuditLogs] = useState<AuditLog[]>([]);

  const [notification, setNotification] = useState<string>('');

  useEffect(() => {
    loadAdminData();
  }, []);

  async function loadAdminData() {
    const evts = await getAllEventsAdmin();
    setEvents(evts);

    const comms = await getAllCommunitiesAdmin();
    setCommunities(comms);

    const phs = await getAllPhotosAdmin();
    setPhotos(phs);

    const vids = await getAllVideosAdmin();
    setVideos(vids);

    const progs = await getAllTrainingProgramsAdmin();
    setTrainingList(progs);

    const st = await getAllStoriesAdmin();
    setStories(st);

    const ach = await getAllAchievementsAdmin();
    setAchievements(ach);

    const ann = await getAllAnnouncementsAdmin();
    setAnnouncements(ann);

    const stats = await getAllStatisticsAdmin();
    setStatistics(stats);

    const logs = await getAuditLogs();
    setAuditLogs(logs);
  }

  const showNotification = (msg: string) => {
    setNotification(msg);
    setTimeout(() => setNotification(''), 3000);
  };

  // Event Handlers
  const handleToggleEventStatus = async (evt: Event) => {
    const nextStatus = evt.status === 'published' ? 'draft' : 'published';
    await updateEvent(evt.id, { status: nextStatus });
    showNotification(`Event "${evt.title}" updated to ${nextStatus.toUpperCase()}`);
    loadAdminData();
  };

  const handleArchiveEvent = async (evt: Event) => {
    if (window.confirm(`Archive event "${evt.title}"? It will be hidden from public view.`)) {
      await archiveEvent(evt.id);
      showNotification(`Event "${evt.title}" archived.`);
      loadAdminData();
    }
  };

  const handleCreateEvent = async () => {
    const title = prompt('Enter Event Title:');
    if (!title) return;
    await createEvent({
      title,
      slug: title.toLowerCase().replace(/[^a-z0-9]/g, '-'),
      category: 'Technology',
      status: 'published'
    });
    showNotification(`Event "${title}" created and published.`);
    loadAdminData();
  };

  // Photo Handlers
  const handleCreatePhoto = async () => {
    const caption = prompt('Enter Photo Caption:');
    if (!caption) return;
    const image = prompt('Enter Image URL:', '/brandex-full-logo.png');
    await createPhoto({
      caption,
      image: image || '/brandex-full-logo.png',
      category: 'Events',
      status: 'published'
    });
    showNotification(`Photo record created.`);
    loadAdminData();
  };

  const handleArchivePhoto = async (p: Photo) => {
    await archivePhoto(p.id);
    showNotification(`Photo archived.`);
    loadAdminData();
  };

  // Video Handlers
  const handleCreateVideo = async () => {
    const title = prompt('Enter YouTube Video Title:');
    if (!title) return;
    const youtubeUrl = prompt('Enter YouTube URL:', 'https://www.youtube.com/watch?v=dQw4w9WgXcQ');
    await createVideo({
      title,
      youtubeUrl: youtubeUrl || 'https://www.youtube.com/watch?v=dQw4w9WgXcQ',
      category: 'Technology',
      status: 'published'
    });
    showNotification(`YouTube Video "${title}" added.`);
    loadAdminData();
  };

  const handleArchiveVideo = async (v: YouTubeVideo) => {
    await archiveVideo(v.id);
    showNotification(`Video archived.`);
    loadAdminData();
  };

  // Story Handlers
  const handleCreateStory = async () => {
    const title = prompt('Enter Story Title:');
    if (!title) return;
    await createStory({
      title,
      slug: title.toLowerCase().replace(/[^a-z0-9]/g, '-'),
      excerpt: 'New community story highlight.',
      category: 'Community Story',
      status: 'published'
    });
    showNotification(`Story "${title}" created.`);
    loadAdminData();
  };

  // Statistic Update
  const handleUpdateStatNumber = async (stat: Statistic) => {
    const val = prompt(`Enter new value for ${stat.label}:`, stat.number.toString());
    if (!val) return;
    const num = parseInt(val, 10);
    if (isNaN(num)) return;
    await updateStatistic(stat.id, { number: num });
    showNotification(`Statistic "${stat.label}" updated to ${num}.`);
    loadAdminData();
  };

  return (
    <div className="space-y-8 pb-20 pt-28 w-full px-4 sm:px-8 lg:px-12 xl:px-24 bg-white">
      
      {/* Header */}
      <div className="bg-slate-50 border border-slate-200 rounded-2xl p-6 flex flex-col md:flex-row md:items-center justify-between gap-4 shadow-sm">
        <div className="flex items-center gap-3">
          <div className="p-2.5 bg-indigo-600 text-white rounded-xl">
            <Shield className="w-6 h-6" />
          </div>
          <div>
            <span className="text-[11px] font-semibold text-indigo-600 tracking-wider uppercase">
              Brandex Showcase CMS
            </span>
            <h1 className="font-display font-bold text-2xl text-slate-900">
              Content Management & Telemetry Control
            </h1>
          </div>
        </div>

        <button
          onClick={loadAdminData}
          className="inline-flex items-center gap-2 border border-slate-300 bg-white px-4 py-2 rounded-xl text-xs font-semibold text-slate-700 hover:bg-slate-100 transition-colors shadow-sm"
        >
          <RefreshCw className="w-3.5 h-3.5" />
          <span>Refresh Showcase Data</span>
        </button>
      </div>

      {notification && (
        <div className="p-3 bg-indigo-50 border border-indigo-200 text-indigo-700 rounded-xl text-xs font-semibold flex items-center justify-between animate-fade-in">
          <span>{notification}</span>
          <CheckCircle className="w-4 h-4" />
        </div>
      )}

      {/* Admin Tab Bar */}
      <div className="flex items-center gap-2 border-b border-slate-200 pb-3 overflow-x-auto">
        {[
          { key: 'dashboard', label: 'Overview Dashboard' },
          { key: 'events', label: `Events (${events.length})` },
          { key: 'communities', label: `Communities (${communities.length})` },
          { key: 'photos', label: `Photos (${photos.length})` },
          { key: 'videos', label: `Videos (${videos.length})` },
          { key: 'stories', label: `Stories (${stories.length})` },
          { key: 'achievements', label: `Achievements (${achievements.length})` },
          { key: 'training', label: `Training (${trainingList.length})` },
          { key: 'statistics', label: `Telemetry (${statistics.length})` },
          { key: 'audit', label: `Audit Log (${auditLogs.length})` },
        ].map((tab) => (
          <button
            key={tab.key}
            onClick={() => setActiveTab(tab.key as any)}
            className={`px-4 py-2 text-xs font-semibold rounded-lg transition-colors whitespace-nowrap ${
              activeTab === tab.key
                ? 'bg-slate-900 text-white shadow-sm'
                : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* TAB 1: OVERVIEW DASHBOARD */}
      {activeTab === 'dashboard' && (
        <div className="space-y-8">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {[
              { label: 'Published Events', val: events.filter(e => e.status === 'published').length, icon: Calendar },
              { label: 'Published Photos', val: photos.filter(p => p.status === 'published').length, icon: ImageIcon },
              { label: 'YouTube Videos', val: videos.filter(v => v.status === 'published').length, icon: Video },
              { label: 'Impact Stories', val: stories.filter(s => s.status === 'published').length, icon: FileText },
            ].map((card, idx) => (
              <div key={idx} className="bg-white border border-slate-200 rounded-xl p-5 space-y-2 shadow-sm">
                <div className="flex items-center justify-between text-slate-500">
                  <span className="text-xs font-semibold text-slate-600">{card.label}</span>
                  <card.icon className="w-4 h-4 text-indigo-600" />
                </div>
                <span className="font-display font-bold text-3xl text-slate-900">{card.val}</span>
              </div>
            ))}
          </div>

          <div className="bg-slate-50 border border-slate-200 rounded-xl p-6 space-y-4">
            <h3 className="font-display font-bold text-lg text-slate-900">Recent Content Audit Trail</h3>
            {auditLogs.length === 0 ? (
              <p className="text-xs text-slate-500">No audit log entries recorded in this session yet.</p>
            ) : (
              <div className="space-y-2">
                {auditLogs.slice(0, 5).map(log => (
                  <div key={log.id} className="bg-white border border-slate-200 p-3 rounded-lg flex items-center justify-between text-xs">
                    <span className="font-semibold text-slate-800">{log.user} performed <strong className="text-indigo-600 uppercase">{log.action}</strong> on {log.entity} (#{log.entityId})</span>
                    <span className="text-slate-400">{new Date(log.timestamp).toLocaleTimeString()}</span>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      )}

      {/* TAB 2: EVENTS CRUD */}
      {activeTab === 'events' && (
        <div className="space-y-4">
          <div className="flex justify-between items-center">
            <h2 className="font-display font-bold text-xl text-slate-900">Events Management</h2>
            <button
              onClick={handleCreateEvent}
              className="inline-flex items-center gap-1.5 bg-indigo-600 text-white px-4 py-2 rounded-xl text-xs font-semibold hover:bg-indigo-700 shadow-sm"
            >
              <Plus className="w-4 h-4" />
              <span>Add Event</span>
            </button>
          </div>

          <div className="border border-slate-200 rounded-xl overflow-hidden shadow-sm">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-50 border-b border-slate-200 font-semibold text-slate-700">
                <tr>
                  <th className="p-3">Title</th>
                  <th className="p-3">Date & Venue</th>
                  <th className="p-3">Category</th>
                  <th className="p-3">Status</th>
                  <th className="p-3 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-200">
                {events.map((evt) => (
                  <tr key={evt.id} className="hover:bg-slate-50">
                    <td className="p-3 font-semibold text-slate-900">{evt.title}</td>
                    <td className="p-3 text-slate-600">{evt.date} ({evt.venue})</td>
                    <td className="p-3 text-indigo-600 font-semibold">{evt.category}</td>
                    <td className="p-3">
                      <span className={`px-2 py-0.5 rounded text-[10px] font-semibold uppercase ${
                        evt.status === 'published' ? 'bg-emerald-100 text-emerald-800' : 'bg-amber-100 text-amber-800'
                      }`}>
                        {evt.status}
                      </span>
                    </td>
                    <td className="p-3 text-right space-x-2">
                      <button
                        onClick={() => handleToggleEventStatus(evt)}
                        className="px-2.5 py-1 border border-slate-300 rounded font-semibold text-slate-700 hover:bg-slate-100"
                      >
                        Toggle Status
                      </button>
                      <button
                        onClick={() => handleArchiveEvent(evt)}
                        className="px-2.5 py-1 bg-amber-50 text-amber-700 border border-amber-200 rounded font-semibold hover:bg-amber-100"
                      >
                        Archive
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* TAB 3: PHOTOS CRUD */}
      {activeTab === 'photos' && (
        <div className="space-y-4">
          <div className="flex justify-between items-center">
            <h2 className="font-display font-bold text-xl text-slate-900">Photo Archive Management</h2>
            <button
              onClick={handleCreatePhoto}
              className="inline-flex items-center gap-1.5 bg-indigo-600 text-white px-4 py-2 rounded-xl text-xs font-semibold hover:bg-indigo-700 shadow-sm"
            >
              <Plus className="w-4 h-4" />
              <span>Add Photo Record</span>
            </button>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
            {photos.map((p) => (
              <div key={p.id} className="bg-white border border-slate-200 rounded-xl overflow-hidden p-3 space-y-2">
                <img src={p.image} alt={p.caption} className="w-full h-32 object-cover rounded-lg" />
                <p className="font-semibold text-xs text-slate-900 line-clamp-1">{p.caption}</p>
                <div className="flex justify-between items-center pt-2 border-t border-slate-100 text-[11px]">
                  <span className="text-indigo-600 font-semibold">{p.category}</span>
                  <button
                    onClick={() => handleArchivePhoto(p)}
                    className="text-amber-600 font-semibold hover:underline"
                  >
                    Archive
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* TAB 4: VIDEOS CRUD */}
      {activeTab === 'videos' && (
        <div className="space-y-4">
          <div className="flex justify-between items-center">
            <h2 className="font-display font-bold text-xl text-slate-900">YouTube Video System</h2>
            <button
              onClick={handleCreateVideo}
              className="inline-flex items-center gap-1.5 bg-indigo-600 text-white px-4 py-2 rounded-xl text-xs font-semibold hover:bg-indigo-700 shadow-sm"
            >
              <Plus className="w-4 h-4" />
              <span>Add YouTube Video</span>
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {videos.map((v) => (
              <div key={v.id} className="bg-white border border-slate-200 rounded-xl p-4 flex gap-4 items-center">
                <img src={v.thumbnail} alt={v.title} className="w-28 h-20 object-cover rounded-lg shrink-0" />
                <div className="space-y-1 flex-1">
                  <span className="text-[10px] text-indigo-600 font-semibold uppercase">{v.category}</span>
                  <h4 className="font-bold text-xs text-slate-900 line-clamp-1">{v.title}</h4>
                  <span className="text-[10px] text-slate-400 font-mono block">ID: {v.youtubeId}</span>
                  <button
                    onClick={() => handleArchiveVideo(v)}
                    className="text-amber-600 text-[11px] font-semibold hover:underline"
                  >
                    Archive Video
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* TAB 5: TELEMETRY & STATISTICS */}
      {activeTab === 'statistics' && (
        <div className="space-y-4">
          <h2 className="font-display font-bold text-xl text-slate-900">Configurable Impact Telemetry</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {statistics.map((st) => (
              <div key={st.id} className="bg-white border border-slate-200 rounded-xl p-5 space-y-2 flex justify-between items-center">
                <div>
                  <span className="text-xs text-slate-500 font-semibold">{st.label}</span>
                  <div className="font-display font-bold text-2xl text-slate-900">{st.number}{st.suffix}</div>
                  <p className="text-xs text-slate-600">{st.description}</p>
                </div>
                <button
                  onClick={() => handleUpdateStatNumber(st)}
                  className="px-3 py-1.5 border border-indigo-200 bg-indigo-50 text-indigo-600 rounded-lg text-xs font-semibold hover:bg-indigo-100"
                >
                  Edit Value
                </button>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* TAB 6: AUDIT LOG */}
      {activeTab === 'audit' && (
        <div className="space-y-4">
          <h2 className="font-display font-bold text-xl text-slate-900">Platform Audit Trail</h2>
          <div className="border border-slate-200 rounded-xl overflow-hidden shadow-sm">
            <table className="w-full text-left text-xs font-mono">
              <thead className="bg-slate-50 border-b border-slate-200 text-slate-700 font-semibold">
                <tr>
                  <th className="p-3">User</th>
                  <th className="p-3">Action</th>
                  <th className="p-3">Entity</th>
                  <th className="p-3">Entity ID</th>
                  <th className="p-3 text-right">Timestamp</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-200">
                {auditLogs.map((log) => (
                  <tr key={log.id}>
                    <td className="p-3 font-semibold text-slate-900">{log.user}</td>
                    <td className="p-3 uppercase text-indigo-600 font-bold">{log.action}</td>
                    <td className="p-3 text-slate-700">{log.entity}</td>
                    <td className="p-3 text-slate-500">{log.entityId}</td>
                    <td className="p-3 text-right text-slate-400">{new Date(log.timestamp).toLocaleString()}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

    </div>
  );
};
