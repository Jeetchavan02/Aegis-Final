import React from 'react';
import { Shield, ShieldAlert, Cpu, Database, Activity } from 'lucide-react';

const ResultDisplay = ({ result }) => {
    const isFake = result.prediction === 'FAKE';
    const credibilityColor = isFake ? 'var(--danger)' : 'var(--success)';
    
    return (
        <div className="animate-fade-in" style={{ display: 'flex', flexDirection: 'column', height: '100%' }}>
            
            <div style={{
                background: isFake ? 'rgba(239, 68, 68, 0.05)' : 'rgba(16, 185, 129, 0.05)',
                border: `1px solid ${isFake ? 'rgba(239, 68, 68, 0.2)' : 'rgba(16, 185, 129, 0.2)'}`,
                padding: '2rem',
                display: 'flex',
                alignItems: 'center',
                gap: '1.5rem',
                marginBottom: '1.5rem'
            }}>
                <div style={{ flex: '0 0 auto' }}>
                    {isFake ? (
                        <ShieldAlert size={48} color="var(--danger)" />
                    ) : (
                        <Shield size={48} color="var(--success)" />
                    )}
                </div>
                <div>
                    <h2 className="tech-font" style={{ color: credibilityColor, fontSize: '1.5rem', marginBottom: '0.25rem', letterSpacing: '0.1em' }}>
                        {isFake ? 'MANIPULATION DETECTED' : 'AUTHENTICITY VERIFIED'}
                    </h2>
                    <p style={{ color: 'var(--text-secondary)', fontSize: '0.9rem' }}>
                        {isFake 
                            ? "This content contains significant markers of artificial generation or deceptive manipulation."
                            : "This content aligns with factual patterns and shows no obvious signs of tampering."}
                    </p>
                </div>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: 'minmax(0,1fr) minmax(0,1fr)', gap: '1rem', marginBottom: '1.5rem' }}>
                <div className="sub-panel">
                    <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '1rem', alignItems: 'center' }}>
                        <span className="tech-font" style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                            <Cpu size={14} /> CREDIBILITY SCORE
                        </span>
                        <span style={{ fontWeight: 'bold', fontSize: '1.2rem', color: credibilityColor }}>{result.credibilityScore.toFixed(0)}/100</span>
                    </div>
                    <div style={{ width: '100%', height: '4px', background: 'var(--bg-primary)', position: 'relative' }}>
                        <div style={{ 
                            position: 'absolute', left: 0, top: 0, height: '100%',
                            width: `${result.credibilityScore}%`, 
                            background: credibilityColor,
                            transition: 'width 1s ease-out'
                        }}></div>
                    </div>
                </div>

                <div className="sub-panel">
                    <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '1rem', alignItems: 'center' }}>
                        <span className="tech-font" style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                            <Database size={14} /> AI CONFIDENCE
                        </span>
                        <span style={{ fontWeight: 'bold', fontSize: '1.2rem' }}>{result.confidence.toFixed(1)}%</span>
                    </div>
                    <div style={{ width: '100%', height: '4px', background: 'var(--bg-primary)', position: 'relative' }}>
                        <div style={{ 
                            position: 'absolute', left: 0, top: 0, height: '100%',
                            width: `${result.confidence}%`, 
                            background: 'var(--accent-primary)',
                            transition: 'width 1s ease-out'
                        }}></div>
                    </div>
                </div>
            </div>

            <div className="sub-panel" style={{ flex: 1 }}>
                <div style={{ paddingBottom: '1rem', borderBottom: '1px solid var(--glass-border)', marginBottom: '1rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                    <Activity size={14} color="var(--accent-primary)" /> <span className="tech-font">DIAGNOSTIC TRACE</span>
                </div>
                
                <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', fontSize: '0.9rem' }}>
                    <tbody>
                        <tr style={{ borderBottom: '1px dashed var(--glass-border)' }}>
                            <td style={{ padding: '0.75rem 0', color: 'var(--text-secondary)' }}>Local NLP Model:</td>
                            <td style={{ padding: '0.75rem 0', textAlign: 'right' }}>
                                <span className={`status-badge ${result.modelBreakdown.local.label === 'FAKE' ? 'badge-fake' : 'badge-real'}`}>
                                    {result.modelBreakdown.local.label}
                                </span>
                            </td>
                        </tr>
                        <tr style={{ borderBottom: '1px dashed var(--glass-border)' }}>
                            <td style={{ padding: '0.75rem 0', color: 'var(--text-secondary)' }}>Enterprise Knowledge Graph:</td>
                            <td style={{ padding: '0.75rem 0', textAlign: 'right' }}>
                                <span className={`status-badge ${result.modelBreakdown.api.label === 'FAKE' ? 'badge-fake' : 'badge-real'}`}>
                                    {result.modelBreakdown.api.label}
                                </span>
                            </td>
                        </tr>
                        <tr>
                            <td style={{ padding: '0.75rem 0', color: 'var(--text-secondary)' }}>Analyzed Media Type:</td>
                            <td style={{ padding: '0.75rem 0', textAlign: 'right', fontWeight: 'bold', textTransform: 'uppercase' }}>
                                {result.type}
                            </td>
                        </tr>
                    </tbody>
                </table>
            </div>

        </div>
    );
};

export default ResultDisplay;
