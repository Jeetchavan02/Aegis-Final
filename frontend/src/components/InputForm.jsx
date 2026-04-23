import React, { useState } from 'react';
import { UploadCloud, Activity, Scan, FileText, CheckCircle, AlertOctagon } from 'lucide-react';
import { analyzeData } from '../services/api';
import ResultDisplay from './ResultDisplay';

const InputForm = () => {
    const [text, setText] = useState('');
    const [file, setFile] = useState(null);
    const [loading, setLoading] = useState(false);
    const [result, setResult] = useState(null);
    const [error, setError] = useState('');

    const handleFileChange = (e) => {
        if (e.target.files && e.target.files[0]) {
            setFile(e.target.files[0]);
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!text && !file) {
            setError("Please provide text or upload a media file for analysis.");
            return;
        }

        setError('');
        setLoading(true);
        setResult(null);

        const formData = new FormData();
        formData.append('text', text);
        if (file) {
            formData.append('media', file);
            if (file.type.startsWith('image/')) formData.append('type', 'image');
            else if (file.type.startsWith('video/')) formData.append('type', 'video');
            else formData.append('type', 'document');
        } else {
            formData.append('type', 'text');
        }

        try {
            const data = await analyzeData(formData);
            if (data.success) {
                setResult(data.data);
            } else {
                setError("Analysis returned an unhandled error.");
            }
        } catch (err) {
            setError(err.error || "An error occurred during verification.");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="animate-fade-in">
            {/* Header Section */}
            <div style={{ marginBottom: '2rem', display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                <div>
                    <div className="tech-font" style={{ color: 'var(--accent-primary)', marginBottom: '0.5rem' }}>
                        // ENGINE MODULE 01
                    </div>
                    <h1 style={{ fontSize: '2.5rem', margin: 0 }}>Analysis Engine</h1>
                    <p style={{ color: 'var(--text-secondary)', maxWidth: '600px', marginTop: '0.5rem', lineHeight: '1.5' }}>
                        Submit suspicious text, URLs, or media for forensic verification. Multi-model AI analysis cross-references local and cloud detectors.
                    </p>
                </div>
                <div className="status-badge badge-real" style={{ padding: '0.5rem 1rem' }}>
                    <Activity size={14} /> ENGINE READY
                </div>
            </div>

            {/* Two Column Layout */}
            <div style={{ display: 'grid', gridTemplateColumns: 'minmax(0, 1fr) minmax(0, 1fr)', gap: '1.5rem', alignItems: 'start' }}>
                
                {/* Left Column: Input Form */}
                <div className="glass-panel" style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
                    <div style={{ paddingBottom: '1rem', borderBottom: '1px solid var(--glass-border)', display: 'flex', alignItems: 'center', gap: '0.5rem', fontWeight: 'bold' }}>
                        <FileText size={18} color="var(--accent-primary)" /> CONTENT SUBMISSION
                    </div>

                    <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
                        <div className="form-group" style={{ marginBottom: 0 }}>
                            <label className="form-label">SUSPICIOUS CONTENT / URL</label>
                            <textarea
                                className="form-control"
                                rows="5"
                                placeholder="Paste a news article, tweet text, or URL here for analysis..."
                                value={text}
                                onChange={(e) => setText(e.target.value)}
                                style={{ resize: 'vertical' }}
                            ></textarea>
                        </div>

                        <div className="form-group" style={{ marginBottom: 0 }}>
                            <label className="form-label">MEDIA EVIDENCE (IMAGE / VIDEO)</label>
                            <div style={{ 
                                border: '1px dashed var(--glass-border)', 
                                padding: '2.5rem 2rem', 
                                textAlign: 'center', 
                                borderRadius: '2px',
                                background: 'rgba(0,0,0,0.2)',
                                cursor: 'pointer',
                                position: 'relative',
                                transition: 'all 0.2s ease'
                            }}
                            onMouseOver={(e) => e.currentTarget.style.borderColor = 'var(--accent-primary)'}
                            onMouseOut={(e) => e.currentTarget.style.borderColor = 'var(--glass-border)'}
                            >
                                <input 
                                    type="file" 
                                    accept="image/*,video/*" 
                                    onChange={handleFileChange}
                                    style={{
                                        position: 'absolute',
                                        top: 0, left: 0, width: '100%', height: '100%',
                                        opacity: 0, cursor: 'pointer'
                                    }}
                                />
                                {file ? (
                                    <div style={{ color: 'var(--success)', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '0.75rem' }}>
                                        <CheckCircle size={32} />
                                        <span style={{ fontWeight: '500' }}>{file.name}</span>
                                    </div>
                                ) : (
                                    <div style={{ color: 'var(--text-secondary)', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '0.75rem' }}>
                                        <UploadCloud size={32} color="var(--text-muted)" />
                                        <span><strong style={{ color: 'var(--accent-primary)' }}>Drop file</strong> or click to upload</span>
                                        <div className="tech-font" style={{ fontSize: '0.7rem' }}>JPG • PNG • MP4 • WEBM</div>
                                    </div>
                                )}
                            </div>
                        </div>

                        {error && (
                            <div style={{ padding: '0.75rem', background: 'rgba(239, 68, 68, 0.1)', color: 'var(--danger)', borderRadius: '2px', display: 'flex', alignItems: 'center', gap: '0.5rem', fontSize: '0.9rem' }}>
                                <AlertOctagon size={16} /> {error}
                            </div>
                        )}

                        <button type="submit" className="btn btn-primary" style={{ width: '100%', padding: '1rem' }} disabled={loading}>
                            <Scan size={18} /> {loading ? 'SCANNING SYSTEM...' : 'INITIATE FORENSIC SCAN'}
                        </button>
                    </form>
                </div>

                {/* Right Column: Results */}
                <div className="glass-panel" style={{ height: '100%', minHeight: '500px', display: 'flex', flexDirection: 'column' }}>
                    <div style={{ paddingBottom: '1rem', borderBottom: '1px solid var(--glass-border)', display: 'flex', alignItems: 'center', gap: '0.5rem', fontWeight: 'bold', marginBottom: '1.5rem' }}>
                        <Activity size={18} color="var(--accent-primary)" /> AUTHENTICITY ANALYSIS
                    </div>

                    {!result && !loading && (
                        <div style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', color: 'var(--text-secondary)', textAlign: 'center', padding: '2rem' }}>
                            <Scan size={48} color="var(--text-muted)" style={{ marginBottom: '1.5rem', opacity: 0.5 }} />
                            <h3 style={{ textTransform: 'uppercase', letterSpacing: '0.1em', marginBottom: '0.5rem' }}>Awaiting Input...</h3>
                            <p style={{ fontSize: '0.9rem', maxWidth: '250px' }}>Submit content on the left and run a scan to generate an authenticity analysis.</p>
                        </div>
                    )}

                    {loading && (
                        <div style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', textAlign: 'center' }}>
                            <div style={{ width: '40px', height: '40px', border: '2px solid var(--glass-border)', borderTopColor: 'var(--accent-primary)', borderRadius: '50%', animation: 'spin 1s linear infinite', margin: '0 auto 1.5rem auto' }}></div>
                            <style>{"@keyframes spin { 100% { transform: rotate(360deg); } }"}</style>
                            <h3 style={{ textTransform: 'uppercase', letterSpacing: '0.1em', color: 'var(--accent-primary)', marginBottom: '0.5rem' }}>Analyzing Vectors</h3>
                            <p className="tech-font" style={{ color: 'var(--text-muted)' }}>Cross-referencing global databases...</p>
                        </div>
                    )}

                    {result && !loading && (
                        <div style={{ flex: 1 }}>
                            <ResultDisplay result={result} />
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default InputForm;
