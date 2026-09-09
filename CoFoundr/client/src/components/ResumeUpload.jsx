import React, { useState, useEffect } from 'react';
import api from '../services/api';
import Button from './ui/Button';

const ResumeUpload = () => {
  const [resumeObj, setResumeObj] = useState(null);
  const [loading, setLoading] = useState(true);
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [file, setFile] = useState(null);

  useEffect(() => {
    fetchProfile();
  }, []);

  const fetchProfile = async () => {
    try {
      const res = await api.get('/users/profile');
      if (res.data.success && res.data.user && res.data.user.resume) {
        try {
          const parsed = JSON.parse(res.data.user.resume);
          setResumeObj(parsed);
        } catch(e) {
          setResumeObj({ url: res.data.user.resume, fileName: 'Resume' });
        }
      } else {
        setResumeObj(null);
      }
    } catch (err) {
      console.error(err);
    }
    setLoading(false);
  };

  const handleFileChange = (e) => {
    setError('');
    setSuccess('');
    const selectedFile = e.target.files[0];
    if (!selectedFile) return;

    const allowedTypes = ['application/pdf', 'application/msword', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document'];
    if (!allowedTypes.includes(selectedFile.type)) {
      setError('Please upload a PDF, DOC, or DOCX file.');
      return;
    }

    if (selectedFile.size > 5 * 1024 * 1024) {
      setError('Resume must be smaller than 5 MB.');
      return;
    }

    setFile(selectedFile);
  };

  const handleUpload = async (fileToUpload) => {
    const targetFile = fileToUpload || file;
    if (!targetFile) return;
    
    setUploading(true);
    setError('');
    setSuccess('');

    const formData = new FormData();
    formData.append('resume', targetFile);

    try {
      const res = await api.post('/users/profile/resume', formData, {
        headers: { 'Content-Type': 'multipart/form-data' }
      });

      if (res.data.success) {
        setSuccess('Resume uploaded successfully.');
        setFile(null);
        try {
          setResumeObj(JSON.parse(res.data.user.resume));
        } catch(e) {
          setResumeObj({ url: res.data.fileUrl, fileName: targetFile.name });
        }
      }
    } catch (err) {
      setError(err.response?.data?.message || 'Upload failed.');
    }
    setUploading(false);
  };

  const handleDelete = async () => {
    if (!window.confirm('Are you sure you want to delete your resume?')) return;
    
    setUploading(true);
    setError('');
    try {
      const res = await api.delete('/users/profile/resume');
      if (res.data.success) {
        setSuccess('Resume deleted successfully.');
        setResumeObj(null);
        setFile(null);
      }
    } catch (err) {
      setError('Failed to delete resume.');
    }
    setUploading(false);
  };

  if (loading) return <div className="h-20 flex items-center justify-center"><div className="w-6 h-6 border-2 border-indigo-600 border-t-transparent rounded-full animate-spin"></div></div>;

  return (
    <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-6 mt-8">
      <h2 className="text-xl font-bold text-slate-900 mb-2">Resume</h2>
      <p className="text-sm text-slate-500 mb-6">Upload your resume so potential co-founders can understand your experience.</p>
      
      {error && <div className="bg-rose-50 text-rose-600 p-3 rounded-lg text-sm mb-4 border border-rose-100">{error}</div>}
      {success && <div className="bg-emerald-50 text-emerald-600 p-3 rounded-lg text-sm mb-4 border border-emerald-100">{success}</div>}

      {resumeObj ? (
        <div className="border border-slate-200 rounded-xl p-4 flex flex-col sm:flex-row items-center justify-between bg-slate-50">
          <div className="flex items-center space-x-3 mb-4 sm:mb-0">
            <div className="w-10 h-10 bg-indigo-100 text-indigo-600 rounded-lg flex items-center justify-center">
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M7 21h10a2 2 0 002-2V9.414a1 1 0 00-.293-.707l-5.414-5.414A1 1 0 0012.586 3H7a2 2 0 00-2 2v14a2 2 0 002 2z" /></svg>
            </div>
            <div>
              <p className="font-semibold text-slate-900 truncate max-w-[200px]">{resumeObj.fileName || 'Resume.pdf'}</p>
              <p className="text-xs text-emerald-600 font-medium">Uploaded successfully</p>
            </div>
          </div>
          <div className="flex flex-wrap gap-2 justify-center">
            <a href={`http://localhost:5000${resumeObj.url}`} target="_blank" rel="noopener noreferrer" className="px-3 py-1.5 text-sm font-medium text-indigo-600 bg-indigo-50 hover:bg-indigo-100 rounded-lg transition-colors">View</a>
            <a href={`http://localhost:5000${resumeObj.url}`} download className="px-3 py-1.5 text-sm font-medium text-slate-700 bg-white border border-slate-200 hover:bg-slate-50 rounded-lg transition-colors">Download</a>
            <label className="px-3 py-1.5 text-sm font-medium text-slate-700 bg-white border border-slate-200 hover:bg-slate-50 rounded-lg transition-colors cursor-pointer">
              Replace
              <input type="file" className="hidden" accept=".pdf,.doc,.docx" onChange={(e) => {
                const selected = e.target.files[0];
                if(selected) {
                   handleUpload(selected);
                }
              }} />
            </label>
            <button onClick={handleDelete} disabled={uploading} className="px-3 py-1.5 text-sm font-medium text-rose-600 bg-rose-50 hover:bg-rose-100 rounded-lg transition-colors">Delete</button>
          </div>
        </div>
      ) : (
        <div className="border-2 border-dashed border-slate-200 rounded-xl p-8 text-center hover:border-indigo-400 transition-colors bg-slate-50 relative">
          <input 
             type="file" 
             className="absolute inset-0 w-full h-full opacity-0 cursor-pointer" 
             accept=".pdf,.doc,.docx" 
             onChange={handleFileChange} 
          />
          <div className="w-12 h-12 bg-white rounded-full flex items-center justify-center mx-auto mb-4 shadow-sm border border-slate-100 relative z-10 pointer-events-none">
            <svg className="w-6 h-6 text-indigo-500" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-8l-4-4m0 0L8 8m4-4v12" /></svg>
          </div>
          <p className="text-slate-700 font-medium mb-1 relative z-10 pointer-events-none">Drag & drop your resume here</p>
          <p className="text-sm text-slate-500 mb-4 relative z-10 pointer-events-none">or click to browse from your computer</p>
          
          <div className="inline-block relative z-10 pointer-events-none">
            <span className="px-4 py-2 bg-indigo-600 text-white text-sm font-medium rounded-lg shadow-sm">
              Choose File
            </span>
          </div>
          <p className="text-xs text-slate-400 mt-4 relative z-10 pointer-events-none">PDF, DOC or DOCX &bull; Max 5 MB</p>
        </div>
      )}
      
      {file && !resumeObj && (
        <div className="mt-4 flex items-center justify-between bg-white p-4 rounded-xl border border-slate-200 shadow-sm">
          <span className="text-sm font-medium text-slate-700 truncate max-w-[200px]">{file.name}</span>
          <Button onClick={() => handleUpload(file)} isLoading={uploading} size="sm">
            {uploading ? 'Uploading resume...' : 'Upload Resume'}
          </Button>
        </div>
      )}
    </div>
  );
};

export default ResumeUpload;
