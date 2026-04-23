import React, { useEffect, useState } from 'react';
import { Chart as ChartJS, ArcElement, Tooltip, Legend, CategoryScale, LinearScale, PointElement, LineElement, Title } from 'chart.js';
import { Pie, Line } from 'react-chartjs-2';
import { Activity, AlertTriangle, Scan, PieChart as PieChartIcon, Maximize2, Minimize2 } from 'lucide-react';
import { getHistory } from '../services/api';

ChartJS.register(ArcElement, Tooltip, Legend, CategoryScale, LinearScale, PointElement, LineElement, Title);

const Dashboard = () => {
    const [history, setHistory] = useState([]);
    const [loading, setLoading] = useState(true);
    const [isFullscreen, setIsFullscreen] = useState(false);
    const [isTableExpanded, setIsTableExpanded] = useState(false);

    useEffect(() => {
        const fetchHistory = async () => {
            try {
                const data = await getHistory();
                setHistory(data);
            } catch (error) {
                console.error("Failed to load history", error);
            } finally {
                setLoading(false);
            }
        };
        fetchHistory();
    }, []);

    const fakeCount = history.filter(item => item.prediction === 'FAKE').length;
    const realCount = history.filter(item => item.prediction === 'REAL').length;
    
    // Calculate Average Credibility
    const totalCredibility = history.reduce((sum, item) => sum + item.credibilityScore, 0);
    const avgCredibility = history.length > 0 ? Math.round(totalCredibility / history.length) : 0;

    const pieData = {
        labels: ['FAKE', 'REAL'],
        datasets: [
            {
                data: [fakeCount, realCount],
                backgroundColor: ['#ef4444', '#10b981'],
                borderColor: ['rgba(239, 68, 68, 0.2)', 'rgba(16, 185, 129, 0.2)'],
                borderWidth: 2,
                cutout: '65%' // Makes it a doughnut chart
            },
        ],
    };

    const reversedHistory = [...history].reverse().slice(-10);
    const lineData = {
        labels: reversedHistory.map((_, i) => `Scan ${i + 1}`),
        datasets: [
            {
                label: 'AVG CREDIBILITY SCORE',
                data: reversedHistory.map(item => item.credibilityScore),
                borderColor: '#4f46e5', // matches the screenshot's purplish-blue
                backgroundColor: '#4f46e5',
                tension: 0.4,
                borderWidth: 2,
                pointRadius: 4,
                pointBackgroundColor: '#4f46e5'
            }
        ],
    };

    const graphOptions = {
        responsive: true,
        plugins: {
            legend: {
                position: 'top',
                labels: { color: '#f8fafc', font: { family: 'SFMono-Regular, monospace' } }
            }
        },
        scales: {
            x: { ticks: { color: '#64748b', font: { family: 'SFMono-Regular, monospace' } }, grid: { color: 'rgba(255,255,255,0.02)' } },
            y: { 
                // Removed fixed min/max to let Chart.js dynamically adjust scale based on data points
                ticks: { color: '#64748b', font: { family: 'SFMono-Regular, monospace' } }, 
                grid: { color: 'rgba(255,255,255,0.05)' } 
            }
        }
    };
    
    const pieOptions = {
        responsive: true,
        plugins: {
            legend: { 
                position: 'right', // matching screenshot
                labels: { color: '#f8fafc', font: { family: 'SFMono-Regular, monospace', size: 11 }, padding: 15, usePointStyle: true, boxWidth: 8 } 
            }
        }
    };

    const fullscreenStyle = isFullscreen ? {
        position: 'fixed',
        top: '60px', // sit exactly below navbar
        left: 0,
        width: '100vw',
        height: 'calc(100vh - 60px)',
        zIndex: 90, // lower than navbar's 100!
        background: 'var(--bg-primary)',
        padding: '2rem'
    } : { display: 'flex', flexDirection: 'column' };

    return (
        <div className="animate-fade-in" style={{ paddingBottom: '4rem', minHeight: '80vh' }}>
            
            {/* Header Section */}
            <div style={{ marginBottom: '2rem', display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                <div>
                    <div className="tech-font" style={{ color: 'var(--accent-primary)', marginBottom: '0.5rem' }}>
                        // ENGINE MODULE 02
                    </div>
                    <h1 style={{ fontSize: '2.5rem', margin: 0 }}>Threat Dashboard</h1>
                    <p style={{ color: 'var(--text-secondary)', maxWidth: '600px', marginTop: '0.5rem', lineHeight: '1.5' }}>
                        Aggregated intelligence from all forensic scans across this operator session.
                    </p>
                </div>
                <div style={{ border: '1px solid rgba(16, 185, 129, 0.3)', color: 'var(--success)', padding: '0.5rem 1rem', display: 'flex', alignItems: 'center', gap: '0.5rem', borderRadius: '2px', fontFamily: 'var(--font-mono)', fontSize: '0.8rem' }}>
                    <Activity size={14} /> LIVE FEED
                </div>
            </div>

            {loading ? (
                <div className="glass-panel" style={{ height: '400px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                    <div className="tech-font">LOADING THREAT INTELLIGENCE...</div>
                </div>
            ) : (
                <>
                    {/* Top Metric Cards */}
                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '1.5rem', marginBottom: '1.5rem' }}>
                        <div className="glass-panel" style={{ padding: '1.5rem 2rem' }}>
                            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
                                <span className="tech-font">TOTAL SCANS</span>
                                <Scan size={18} color="var(--accent-primary)" />
                            </div>
                            <div style={{ fontSize: '3rem', fontWeight: 'bold' }}>{history.length}</div>
                            <div style={{ height: '4px', background: 'var(--glass-border)', marginTop: '1rem', position: 'relative' }}>
                                <div style={{ position: 'absolute', top: 0, left: 0, height: '100%', width: '100%', background: 'var(--accent-primary)' }}></div>
                            </div>
                        </div>

                        <div className="glass-panel" style={{ padding: '1.5rem 2rem' }}>
                            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
                                <span className="tech-font">DEEPFAKES DETECTED</span>
                                <AlertTriangle size={18} color="var(--danger)" />
                            </div>
                            <div style={{ fontSize: '3rem', fontWeight: 'bold' }}>{fakeCount}</div>
                            <div style={{ height: '4px', background: 'var(--glass-border)', marginTop: '1rem', position: 'relative' }}>
                                <div style={{ position: 'absolute', top: 0, left: 0, height: '100%', width: `${history.length ? (fakeCount/history.length)*100 : 0}%`, background: 'var(--danger)' }}></div>
                            </div>
                        </div>

                        <div className="glass-panel" style={{ padding: '1.5rem 2rem' }}>
                            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
                                <span className="tech-font">AVERAGE CREDIBILITY</span>
                                <Activity size={18} color="var(--success)" />
                            </div>
                            <div style={{ fontSize: '3rem', fontWeight: 'bold' }}>{avgCredibility}%</div>
                            <div style={{ height: '4px', background: 'var(--glass-border)', marginTop: '1rem', position: 'relative' }}>
                                <div style={{ position: 'absolute', top: 0, left: 0, height: '100%', width: `${avgCredibility}%`, background: 'var(--success)' }}></div>
                            </div>
                        </div>
                    </div>

                    {/* Charts Row */}
                    <div style={{ display: 'grid', gridTemplateColumns: 'minmax(0, 1fr) minmax(0, 2fr)', gap: '1.5rem', marginBottom: '1.5rem' }}>
                        <div className="glass-panel" style={{ display: 'flex', flexDirection: 'column' }}>
                            <div style={{ paddingBottom: '1rem', display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '1rem', fontWeight: 'bold' }}>
                                Threat Distribution
                            </div>
                            <div style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                                {history.length > 0 ? (
                                    <div style={{ maxWidth: '280px', width: '100%' }}>
                                        <Pie data={pieData} options={pieOptions} />
                                    </div>
                                ) : (
                                    <div className="tech-font" style={{ color: 'var(--text-muted)' }}>NO DATA YET</div>
                                )}
                            </div>
                        </div>

                        <div className="glass-panel" style={fullscreenStyle}>
                            <div style={{ paddingBottom: '1rem', display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1rem', fontWeight: 'bold' }}>
                                <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                                    <Activity size={16} /> Credibility Trend Over Time
                                </div>
                                <button 
                                    onClick={() => setIsFullscreen(!isFullscreen)} 
                                    style={{ background: 'none', border: 'none', color: 'var(--text-secondary)', cursor: 'pointer' }}
                                    title="Toggle Fullscreen"
                                >
                                    {isFullscreen ? <Minimize2 size={18} /> : <Maximize2 size={18} />}
                                </button>
                            </div>
                            <div style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '0 1rem', position: 'relative', height: isFullscreen ? 'calc(100vh - 100px)' : 'auto' }}>
                                {history.length > 0 ? (
                                    <Line 
                                        key={isFullscreen ? 'fullscreen' : 'standard'} 
                                        data={lineData} 
                                        options={{...graphOptions, maintainAspectRatio: false}} 
                                    />
                                ) : (
                                    <div className="tech-font" style={{ color: 'var(--text-muted)' }}>NO DATA YET</div>
                                )}
                            </div>
                        </div>
                    </div>

                    {/* Table Row */}
                    <div className="glass-panel">
                        <div style={{ paddingBottom: '1.5rem', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                                <Activity size={16} color="var(--accent-primary)" /> <span className="tech-font">RECENT ACTIVITY LOG</span>
                            </div>
                            <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                                <span className="tech-font" style={{ color: 'var(--text-muted)' }}>{history.length} ENTRIES</span>
                                <button 
                                    onClick={() => setIsTableExpanded(!isTableExpanded)} 
                                    style={{ background: 'none', border: 'none', color: 'var(--text-secondary)', cursor: 'pointer' }}
                                    title="Toggle Expanded View"
                                >
                                    {isTableExpanded ? <Minimize2 size={18} /> : <Maximize2 size={18} />}
                                </button>
                            </div>
                        </div>
                        
                        <div style={{ overflowX: 'auto' }}>
                            <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left' }}>
                                <thead>
                                    <tr>
                                        <th className="table-header" style={{ padding: '1rem 0' }}>DATE</th>
                                        <th className="table-header" style={{ padding: '1rem 0' }}>CONTENT SNIPPET</th>
                                        <th className="table-header" style={{ padding: '1rem 0' }}>TYPE</th>
                                        <th className="table-header" style={{ padding: '1rem 0' }}>STATUS</th>
                                        <th className="table-header" style={{ padding: '1rem 0', textAlign: 'right' }}>CONFIDENCE</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {history.slice(0, isTableExpanded ? history.length : 8).map(item => (
                                        <tr key={item._id} className="table-row">
                                            <td className="tech-font" style={{ padding: '1.2rem 0', color: 'var(--text-secondary)' }}>
                                                {new Date(item.createdAt).toISOString().replace('T', ' ').substring(0, 16)}
                                            </td>
                                            <td style={{ padding: '1.2rem 0', maxWidth: '300px', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                                                {item.text || 'Media Validation Scan...'}
                                            </td>
                                            <td style={{ padding: '1.2rem 0' }}>
                                                <span className="tech-font" style={{ padding: '0.2rem 0.5rem', background: 'var(--bg-tertiary)', borderRadius: '2px', fontSize: '0.7rem' }}>
                                                    {item.type}
                                                </span>
                                            </td>
                                            <td style={{ padding: '1.2rem 0' }}>
                                                <span className={`status-badge ${item.prediction === 'FAKE' ? 'badge-fake' : 'badge-real'}`}>
                                                    {item.prediction}
                                                </span>
                                            </td>
                                            <td className="tech-font" style={{ padding: '1.2rem 0', textAlign: 'right', fontWeight: 'bold' }}>
                                                {item.confidence.toFixed(0)}%
                                            </td>
                                        </tr>
                                    ))}
                                    {history.length === 0 && (
                                        <tr>
                                            <td colSpan="5" className="tech-font" style={{ textAlign: 'center', padding: '3rem', color: 'var(--text-muted)' }}>
                                                AWAITING FIRST SCAN INITIALIZATION
                                            </td>
                                        </tr>
                                    )}
                                </tbody>
                            </table>
                        </div>
                    </div>
                </>
            )}
            
            {/* Footer Bar Simulation */}
            <div style={{ marginTop: '2rem', paddingTop: '1rem', borderTop: '1px solid var(--glass-border)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <span className="tech-font" style={{ color: 'var(--text-muted)', fontSize: '0.7rem' }}>© AEGIS — CLASSIFIED FORENSIC TOOL</span>
                <span className="tech-font" style={{ color: 'var(--success)', fontSize: '0.7rem', display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                    <div style={{ width: '6px', height: '6px', borderRadius: '50%', background: 'var(--success)' }}></div> SYSTEM ONLINE • V1.0.0
                </span>
            </div>
            
        </div>
    );
};

export default Dashboard;
