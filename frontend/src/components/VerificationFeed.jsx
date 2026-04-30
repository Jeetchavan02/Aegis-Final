import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Users, AlertTriangle, CheckCircle, ThumbsUp, ThumbsDown, Link as LinkIcon, Send } from 'lucide-react';

const VerificationFeed = ({ analysisId, requiresReview }) => {
    const [notes, setNotes] = useState([]);
    const [newEvidence, setNewEvidence] = useState('');
    const [newLink, setNewLink] = useState('');
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    
    // Check if user is logged in
    const userStr = localStorage.getItem('user');
    const token = localStorage.getItem('auth_token');
    const user = userStr ? JSON.parse(userStr) : null;

    const [report, setReport] = useState(null);
    const [reportLoading, setReportLoading] = useState(false);

    useEffect(() => {
        if (analysisId) {
            fetchNotes();
            setReport(null); // Reset report when analysis changes
        }
    }, [analysisId]);

    const fetchSentimentReport = async () => {
        setReportLoading(true);
        try {
            const res = await axios.get(`http://localhost:5005/api/verify/sentiment/${analysisId}`);
            setReport(res.data.report);
        } catch (err) {
            console.error("Failed to fetch report:", err);
            const msg = err.response?.data?.error || "Failed to generate report. Ensure there are enough community reviews.";
            alert(msg);
        } finally {
            setReportLoading(false);
        }
    };

    const fetchNotes = async () => {
        try {
            const res = await axios.get(`http://localhost:5005/api/verify/similar/${analysisId}`);
            setNotes(res.data);
            setLoading(false);
        } catch (err) {
            console.error("Failed to fetch notes:", err);
            setError("Failed to load community notes.");
            setLoading(false);
        }
    };

    const handleVote = async (noteId, vote) => {
        if (!user || !token) {
            alert("You must be logged in to vote.");
            return;
        }

        try {
            await axios.patch(`http://localhost:5005/api/verify/vote/${noteId}`, 
                { vote },
                { headers: { 'x-auth-token': token } }
            );
            fetchNotes(); // Refresh to get updated scores
        } catch (err) {
            console.error("Failed to vote:", err);
            alert("Failed to submit vote.");
        }
    };

    const handleSubmitNote = async (e) => {
        e.preventDefault();
        if (!user || !token) {
            alert("You must be logged in to submit a review.");
            return;
        }
        if (newEvidence.trim().length < 20) {
            alert("Please provide more detailed evidence (minimum 20 characters).");
            return;
        }

        try {
            await axios.post('http://localhost:5005/api/verify/note', {
                linkedAnalysisId: analysisId,
                citizenEvidence: newEvidence,
                evidenceLinks: newLink ? [newLink] : []
            }, {
                headers: { 'x-auth-token': token }
            });
            
            setNewEvidence('');
            setNewLink('');
            fetchNotes();
        } catch (err) {
            console.error("Failed to post note:", err);
            const msg = err.response?.data?.error || "Failed to post note.";
            alert(msg);
        }
    };

    if (loading) return <div style={{ color: 'var(--text-secondary)' }}>Loading community consensus...</div>;

    return (
        <div className="animate-fade-in" style={{ padding: '1rem 0' }}>
            {requiresReview && (
                <div style={{
                    background: 'rgba(239, 68, 68, 0.1)',
                    border: '1px solid rgba(239, 68, 68, 0.3)',
                    padding: '1rem',
                    borderRadius: '8px',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '1rem',
                    marginBottom: '1.5rem'
                }}>
                    <AlertTriangle color="var(--danger)" size={24} />
                    <div>
                        <h4 style={{ margin: 0, color: 'var(--danger)', letterSpacing: '0.05em' }}>FORENSIC UNCERTAINTY DETECTED</h4>
                        <p style={{ margin: '0.25rem 0 0', fontSize: '0.85rem', color: 'var(--text-secondary)' }}>
                            Automated models failed to reach a confident consensus. This case requires human verification.
                        </p>
                    </div>
                </div>
            )}

                <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                    <Users color="var(--accent-primary)" size={20} />
                    <h3 style={{ margin: 0, color: 'var(--text-primary)', letterSpacing: '0.1em' }} className="tech-font">CITIZEN REVIEWS</h3>
                </div>
                {notes.length > 0 && (
                    <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                        {notes.length < 2 && (
                            <span style={{ fontSize: '0.65rem', color: 'var(--text-muted)', fontStyle: 'italic' }}>
                                Needs {2 - notes.length} more review{notes.length === 1 ? '' : 's'} for report
                            </span>
                        )}
                        <button 
                            onClick={fetchSentimentReport}
                            disabled={reportLoading || notes.length < 2}
                            style={{
                                background: notes.length < 2 ? 'rgba(255,255,255,0.05)' : 'rgba(0, 163, 255, 0.1)',
                                border: `1px solid ${notes.length < 2 ? 'var(--glass-border)' : 'var(--accent-primary)'}`,
                                color: notes.length < 2 ? 'var(--text-muted)' : 'var(--accent-primary)',
                                padding: '0.4rem 0.8rem',
                                borderRadius: '4px',
                                cursor: notes.length < 2 ? 'not-allowed' : 'pointer',
                                fontSize: '0.75rem',
                                display: 'flex',
                                alignItems: 'center',
                                gap: '0.4rem',
                                fontWeight: 'bold'
                            }}
                        >
                            {reportLoading ? <span className="tech-font">PROCESSING BERT...</span> : <><Send size={12} /> GENERATE BERT CONSENSUS</>}
                        </button>
                    </div>
                )}

            {/* BERT Sentiment Report Display */}
            {report && (
                <div className="animate-fade-in" style={{
                    background: 'linear-gradient(135deg, rgba(6, 182, 212, 0.1) 0%, rgba(59, 130, 246, 0.1) 100%)',
                    border: '1px solid var(--accent-primary)',
                    borderRadius: '8px',
                    padding: '1.25rem',
                    marginBottom: '2rem',
                    boxShadow: '0 4px 20px rgba(0,0,0,0.3)'
                }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '0.75rem' }}>
                        <div style={{ 
                            padding: '0.2rem 0.6rem', 
                            background: report.sentiment === 'POSITIVE' ? 'var(--success)' : report.sentiment === 'NEGATIVE' ? 'var(--danger)' : 'var(--text-muted)',
                            color: '#000',
                            fontWeight: 'bold',
                            fontSize: '0.7rem',
                            borderRadius: '2px'
                        }}>
                            BERT ANALYSYS: {report.sentiment}
                        </div>
                        <span className="tech-font" style={{ fontSize: '0.75rem', color: 'var(--accent-primary)' }}>CONFIDENCE: {report.confidence}%</span>
                    </div>
                    <p style={{ margin: 0, fontSize: '0.9rem', lineHeight: '1.6', color: 'var(--text-primary)', fontStyle: 'italic' }}>
                        "{report.summary}"
                    </p>
                </div>
            )}

            {/* List Notes */}
            {notes.length === 0 ? (
                <div style={{ textAlign: 'center', padding: '2rem', color: 'var(--text-secondary)', background: 'var(--bg-secondary)', borderRadius: '8px', border: '1px dashed var(--glass-border)' }}>
                    No community notes have been added yet. Be the first to verify this content.
                </div>
            ) : (
                <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                    {notes.map(note => (
                        <div key={note._id} style={{
                            background: 'var(--bg-secondary)',
                            border: '1px solid var(--glass-border)',
                            borderRadius: '8px',
                            padding: '1rem'
                        }}>
                            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '0.75rem' }}>
                                <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                                    <span style={{ fontSize: '0.8rem', color: 'var(--accent-primary)', fontFamily: 'var(--font-mono)' }}>
                                        {note.authorId}
                                    </span>
                                    {user && note.authorId.includes(user.email?.substring(0,4)) && (
                                        <span style={{ fontSize: '0.7rem', color: 'var(--text-muted)', background: 'rgba(255,255,255,0.05)', padding: '0.1rem 0.4rem', borderRadius: '4px' }}>
                                            Your Review
                                        </span>
                                    )}
                                    {note.verificationStatus === 'Verified' && (
                                        <span style={{ display: 'flex', alignItems: 'center', gap: '0.2rem', fontSize: '0.75rem', color: 'var(--success)', background: 'rgba(16, 185, 129, 0.1)', padding: '0.1rem 0.4rem', borderRadius: '4px' }}>
                                            <CheckCircle size={12} /> Verified Consensus
                                        </span>
                                    )}
                                    {note.verificationStatus === 'Debunked' && (
                                        <span style={{ display: 'flex', alignItems: 'center', gap: '0.2rem', fontSize: '0.75rem', color: 'var(--danger)', background: 'rgba(239, 68, 68, 0.1)', padding: '0.1rem 0.4rem', borderRadius: '4px' }}>
                                            <AlertTriangle size={12} /> Debunked Consensus
                                        </span>
                                    )}
                                </div>
                                
                                <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', background: 'rgba(0,0,0,0.2)', padding: '0.2rem 0.5rem', borderRadius: '20px' }}>
                                    <button onClick={() => handleVote(note._id, 1)} style={{ background: 'none', border: 'none', color: 'var(--text-secondary)', cursor: 'pointer', padding: '0.2rem' }}>
                                        <ThumbsUp size={14} />
                                    </button>
                                    <span style={{ fontSize: '0.85rem', fontWeight: 'bold', minWidth: '1.5rem', textAlign: 'center', color: note.trustScore > 0 ? 'var(--success)' : note.trustScore < 0 ? 'var(--danger)' : 'var(--text-primary)' }}>
                                        {note.trustScore > 0 ? `+${note.trustScore}` : note.trustScore}
                                    </span>
                                    <button onClick={() => handleVote(note._id, -1)} style={{ background: 'none', border: 'none', color: 'var(--text-secondary)', cursor: 'pointer', padding: '0.2rem' }}>
                                        <ThumbsDown size={14} />
                                    </button>
                                </div>
                            </div>

                            <p style={{ margin: '0 0 1rem 0', fontSize: '0.95rem', lineHeight: '1.5' }}>
                                {note.citizenEvidence}
                            </p>

                            {note.evidenceLinks && note.evidenceLinks.length > 0 && note.evidenceLinks[0] !== '' && (
                                <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                                    <LinkIcon size={14} color="var(--accent-primary)" />
                                    <a href={note.evidenceLinks[0]} target="_blank" rel="noopener noreferrer" style={{ color: 'var(--accent-primary)', fontSize: '0.85rem', textDecoration: 'none' }}>
                                        Source Evidence Link
                                    </a>
                                </div>
                            )}
                        </div>
                    ))}
                </div>
            )}

            {/* Add Note Form */}
            {user ? (
                <form onSubmit={handleSubmitNote} style={{ marginTop: '2rem', background: 'var(--bg-secondary)', padding: '1.5rem', borderRadius: '8px', border: '1px solid var(--glass-border)' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
                        <h4 style={{ margin: 0, color: 'var(--text-primary)' }}>Contribute to Verification</h4>
                        <span style={{ 
                            fontSize: '0.7rem', 
                            color: newEvidence.length >= 20 ? 'var(--success)' : 'var(--danger)',
                            fontFamily: 'var(--font-mono)'
                        }}>
                            {newEvidence.length}/20 min chars
                        </span>
                    </div>
                    <p style={{ fontSize: '0.8rem', color: 'var(--text-muted)', marginBottom: '1rem' }}>
                        Forensic requirement: Minimum 20 characters of evidence description.
                    </p>
                    
                    <textarea 
                        value={newEvidence}
                        onChange={(e) => setNewEvidence(e.target.value)}
                        placeholder="Provide factual context or debunking evidence (at least 20 chars)..."
                        minLength={20}
                        style={{ width: '100%', padding: '0.75rem', background: 'rgba(0,0,0,0.2)', border: '1px solid var(--glass-border)', color: 'var(--text-primary)', borderRadius: '4px', minHeight: '80px', marginBottom: '1rem', resize: 'vertical' }}
                        required
                    />
                    
                    <div style={{ display: 'flex', gap: '1rem', alignItems: 'center' }}>
                        <div style={{ flex: 1, position: 'relative' }}>
                            <LinkIcon size={16} color="var(--text-secondary)" style={{ position: 'absolute', left: '0.75rem', top: '50%', transform: 'translateY(-50%)' }} />
                            <input 
                                type="url" 
                                value={newLink}
                                onChange={(e) => setNewLink(e.target.value)}
                                placeholder="Evidence URL (Optional)"
                                style={{ width: '100%', padding: '0.75rem 0.75rem 0.75rem 2.5rem', background: 'rgba(0,0,0,0.2)', border: '1px solid var(--glass-border)', color: 'var(--text-primary)', borderRadius: '4px' }}
                            />
                        </div>
                        <button type="submit" style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', background: 'var(--accent-primary)', color: '#000', border: 'none', padding: '0.75rem 1.5rem', borderRadius: '4px', cursor: 'pointer', fontWeight: 'bold' }}>
                            <Send size={16} /> Post Review
                        </button>
                    </div>
                </form>
            ) : (
                <div style={{ marginTop: '2rem', textAlign: 'center', padding: '1rem', background: 'rgba(0,0,0,0.2)', borderRadius: '8px', border: '1px dashed var(--glass-border)' }}>
                    <p style={{ margin: 0, color: 'var(--text-secondary)', fontSize: '0.9rem' }}>Log in to submit citizen evidence and vote on community consensus.</p>
                </div>
            )}
        </div>
    );
};

export default VerificationFeed;
