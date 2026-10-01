import React, { useState, useEffect, useContext } from 'react';
import { Link, useParams } from 'react-router-dom';
import api from '../services/api';
import LoadingSpinner from '../components/ui/LoadingSpinner';
import Card from '../components/ui/Card';
import Button from '../components/ui/Button';
import Badge from '../components/ui/Badge';
import Avatar from '../components/ui/Avatar';
import { AuthContext } from '../context/AuthContext';

const Profile = () => {
  const { id } = useParams();
  const { user: currentUser } = useContext(AuthContext);
  const [profile, setProfile] = useState(null);
  const [reviewsData, setReviewsData] = useState({ reviews: [], averageRating: 0 });
  const [loading, setLoading] = useState(true);
  const [showReviewModal, setShowReviewModal] = useState(false);
  const [reviewForm, setReviewForm] = useState({ rating: 5, comment: '', startupId: '' });
  const [myStartups, setMyStartups] = useState([]);

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const endpoint = id ? `/users/${id}` : '/users/profile';
        const res = await api.get(endpoint);
        if (res.data.success) {
          setProfile(res.data.user);
          
          // Fetch reviews
          const profileId = id || res.data.user._id;
          const reviewsRes = await api.get(`/reviews/user/${profileId}`);
          if (reviewsRes.data.success) {
            setReviewsData(reviewsRes.data.data);
          }

          // If looking at another user, fetch my startups to select from for review
          if (id && id !== currentUser._id) {
            const startupsRes = await api.get('/startups/my-startups');
            if (startupsRes.data.success) {
              setMyStartups(startupsRes.data.startups);
              if (startupsRes.data.startups.length > 0) {
                setReviewForm(prev => ({ ...prev, startupId: startupsRes.data.startups[0]._id }));
              }
            }
          }
        }
      } catch (err) {
        console.error(err);
      }
      setLoading(false);
    };
    fetchProfile();
  }, [id, currentUser._id]);

  if (loading) return <LoadingSpinner fullScreen />;
  if (!profile) return <div className="text-center mt-20 text-slate-500">Error loading profile.</div>;

  const renderResume = () => {
  if (!profile.resume) return null;
  let resumeObj = null;
  try {
    resumeObj = JSON.parse(profile.resume);
  } catch(e) {
    resumeObj = { url: profile.resume, fileName: 'Resume' };
  }
  return (
    <Card>
      <div className="flex justify-between items-center border-b border-slate-100 pb-2 mb-3">
        <h3 className="text-lg font-bold text-slate-900">Resume</h3>
      </div>
      <div className="flex items-center justify-between bg-slate-50 border border-slate-200 rounded-xl p-4">
        <div className="flex items-center space-x-3">
          <div className="w-10 h-10 bg-indigo-100 text-indigo-600 rounded-lg flex items-center justify-center">
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M7 21h10a2 2 0 002-2V9.414a1 1 0 00-.293-.707l-5.414-5.414A1 1 0 0012.586 3H7a2 2 0 00-2 2v14a2 2 0 002 2z" /></svg>
          </div>
          <div>
            <p className="font-semibold text-slate-900 truncate max-w-[200px]">{resumeObj.fileName || 'Resume.pdf'}</p>
          </div>
        </div>
        <a href={resumeObj.url.startsWith('http') ? resumeObj.url : `http://localhost:5000${resumeObj.url}`} target="_blank" rel="noopener noreferrer">
          <Button variant="secondary" size="sm">View Resume</Button>
        </a>
      </div>
    </Card>
  );
};


  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="flex justify-between items-end mb-6">
        <h1 className="text-3xl font-bold text-slate-900">Profile</h1>
        {!id || id === currentUser._id ? (
          <Link to="/profile/edit">
            <Button variant="secondary" className="shadow-sm">Edit Profile</Button>
          </Link>
        ) : (
          <Button variant="primary" className="shadow-sm" onClick={() => setShowReviewModal(true)}>Leave Review</Button>
        )}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Left Sidebar */}
        <Card className="md:col-span-1 text-center py-8">
          <div className="flex justify-center mb-4">
            <Avatar name={profile.name} size="xl" className="shadow-lg shadow-indigo-200 ring-4 ring-white" />
          </div>
          <h2 className="text-2xl font-bold text-slate-900">{profile.name}</h2>
          <p className="text-sm text-slate-500 mb-2">{profile.email}</p>
          <Badge variant="primary" className="uppercase tracking-wider mt-2">{profile.role}</Badge>
          
          <div className="mt-8 text-left border-t border-slate-100 pt-6">
            <h4 className="text-xs font-semibold uppercase text-slate-400 mb-3 tracking-wider">Contact & Links</h4>
            <div className="space-y-3">
              {profile.github && (
                <a href={profile.github} target="_blank" rel="noreferrer" className="flex items-center text-sm text-slate-600 hover:text-indigo-600">
                  <svg className="w-5 h-5 mr-3 text-slate-400" fill="currentColor" viewBox="0 0 24 24"><path d="M12 .297c-6.63 0-12 5.373-12 12 0 5.303 3.438 9.8 8.205 11.385.6.113.82-.258.82-.577 0-.285-.01-1.04-.015-2.04-3.338.724-4.042-1.61-4.042-1.61C4.422 18.07 3.633 17.7 3.633 17.7c-1.087-.744.084-.729.084-.729 1.205.084 1.838 1.236 1.838 1.236 1.07 1.835 2.809 1.305 3.495.998.108-.776.417-1.305.76-1.605-2.665-.3-5.466-1.332-5.466-5.93 0-1.31.465-2.38 1.235-3.22-.135-.303-.54-1.523.105-3.176 0 0 1.005-.322 3.3 1.23.96-.267 1.98-.399 3-.405 1.02.006 2.04.138 3 .405 2.28-1.552 3.285-1.23 3.285-1.23.645 1.653.24 2.873.12 3.176.765.84 1.23 1.91 1.23 3.22 0 4.61-2.805 5.625-5.475 5.92.42.36.81 1.096.81 2.22 0 1.606-.015 2.896-.015 3.286 0 .315.21.69.825.57C20.565 22.092 24 17.592 24 12.297c0-6.627-5.373-12-12-12"/></svg>
                  GitHub
                </a>
              )}
              {profile.linkedin && (
                <a href={profile.linkedin} target="_blank" rel="noreferrer" className="flex items-center text-sm text-slate-600 hover:text-indigo-600">
                  <svg className="w-5 h-5 mr-3 text-slate-400" fill="currentColor" viewBox="0 0 24 24"><path d="M19 0h-14c-2.761 0-5 2.239-5 5v14c0 2.761 2.239 5 5 5h14c2.762 0 5-2.239 5-5v-14c0-2.761-2.238-5-5-5zm-11 19h-3v-11h3v11zm-1.5-12.268c-.966 0-1.75-.79-1.75-1.764s.784-1.764 1.75-1.764 1.75.79 1.75 1.764-.783 1.764-1.75 1.764zm13.5 12.268h-3v-5.604c0-3.368-4-3.113-4 0v5.604h-3v-11h3v1.765c1.396-2.586 7-2.777 7 2.476v6.759z"/></svg>
                  LinkedIn
                </a>
              )}
              {profile.portfolio && (
                <a href={profile.portfolio} target="_blank" rel="noreferrer" className="flex items-center text-sm text-slate-600 hover:text-indigo-600">
                  <svg className="w-5 h-5 mr-3 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13.828 10.172a4 4 0 00-5.656 0l-4 4a4 4 0 105.656 5.656l1.102-1.101m-.758-4.899a4 4 0 005.656 0l4-4a4 4 0 00-5.656-5.656l-1.1 1.1" /></svg>
                  Portfolio
                </a>
              )}
              {!profile.github && !profile.linkedin && !profile.portfolio && (
                <p className="text-xs text-slate-400 italic">No links added</p>
              )}
            </div>
          </div>
        </Card>

        {/* Right Content */}
        <div className="md:col-span-2 space-y-6">
          <Card>
            <h3 className="text-lg font-bold text-slate-900 mb-3 border-b border-slate-100 pb-2">About Me</h3>
            {profile.bio ? (
              <p className="text-slate-700 whitespace-pre-wrap text-[15px] leading-relaxed">{profile.bio}</p>
            ) : (
              <p className="text-slate-400 italic text-sm">No bio provided yet.</p>
            )}
          </Card>

          <Card>
            <h3 className="text-lg font-bold text-slate-900 mb-3 border-b border-slate-100 pb-2">Skills</h3>
            <div className="flex flex-wrap gap-2">
              {profile.skills && profile.skills.length > 0 ? (
                profile.skills.map((skill, index) => (
                  <Badge key={index} variant="default" className="text-sm bg-indigo-50 text-indigo-700 border border-indigo-100 px-3 py-1">{skill}</Badge>
                ))
              ) : (
                <p className="text-slate-400 italic text-sm">No skills added.</p>
              )}
            </div>
          </Card>

          <Card>
            <h3 className="text-lg font-bold text-slate-900 mb-3 border-b border-slate-100 pb-2">Experience</h3>
            {profile.experience ? (
              <p className="text-slate-700 whitespace-pre-wrap text-[15px] leading-relaxed">{profile.experience}</p>
            ) : (
              <p className="text-slate-400 italic text-sm">No experience details added.</p>
            )}
          </Card>

          {renderResume()}

          <Card>
            <h3 className="text-lg font-bold text-slate-900 mb-3 border-b border-slate-100 pb-2">Availability</h3>
            {profile.availability ? (
              <Badge variant="success" className="text-sm px-3 py-1">{profile.availability}</Badge>
            ) : (
              <p className="text-slate-400 italic text-sm">Not specified</p>
            )}
          </Card>
          <Card>
            <h3 className="text-lg font-bold text-slate-900 mb-3 border-b border-slate-100 pb-2">Reviews ({reviewsData.averageRating} ★)</h3>
            <div className="space-y-4">
              {reviewsData.reviews.length > 0 ? (
                reviewsData.reviews.map(review => (
                  <div key={review._id} className="border-b border-slate-100 pb-3">
                    <div className="flex justify-between">
                      <div className="font-semibold">{review.reviewer?.name || 'Unknown'}</div>
                      <div className="text-indigo-600">{review.rating} ★</div>
                    </div>
                    <div className="text-xs text-slate-400 mb-2">{review.startupId?.title}</div>
                    <p className="text-sm text-slate-700">{review.comment}</p>
                  </div>
                ))
              ) : (
                <p className="text-slate-400 italic text-sm">No reviews yet.</p>
              )}
            </div>
          </Card>
        </div>
      </div>

      {showReviewModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-xl shadow-xl max-w-md w-full p-6">
            <h2 className="text-xl font-bold mb-4">Leave a Review for {profile.name}</h2>
            <form onSubmit={async (e) => {
              e.preventDefault();
              try {
                await api.post('/reviews', {
                  reviewee: profile._id,
                  startupId: reviewForm.startupId,
                  rating: reviewForm.rating,
                  comment: reviewForm.comment
                });
                setShowReviewModal(false);
                // Refresh reviews
                const reviewsRes = await api.get(`/reviews/user/${profile._id}`);
                if (reviewsRes.data.success) {
                  setReviewsData(reviewsRes.data.data);
                }
              } catch (err) {
                alert(err.response?.data?.message || 'Failed to submit review');
              }
            }}>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium mb-1">Select Startup/Team</label>
                  <select 
                    className="w-full border rounded-lg p-2"
                    value={reviewForm.startupId}
                    onChange={(e) => setReviewForm({...reviewForm, startupId: e.target.value})}
                    required
                  >
                    <option value="" disabled>Select a startup</option>
                    {myStartups.map(s => (
                      <option key={s._id} value={s._id}>{s.title}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1">Rating (1-5)</label>
                  <input 
                    type="number" min="1" max="5" required
                    className="w-full border rounded-lg p-2"
                    value={reviewForm.rating}
                    onChange={(e) => setReviewForm({...reviewForm, rating: Number(e.target.value)})}
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1">Comment</label>
                  <textarea 
                    rows="3"
                    className="w-full border rounded-lg p-2"
                    value={reviewForm.comment}
                    onChange={(e) => setReviewForm({...reviewForm, comment: e.target.value})}
                  ></textarea>
                </div>
              </div>
              <div className="mt-6 flex justify-end space-x-3">
                <Button type="button" variant="secondary" onClick={() => setShowReviewModal(false)}>Cancel</Button>
                <Button type="submit" variant="primary">Submit Review</Button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default Profile;

