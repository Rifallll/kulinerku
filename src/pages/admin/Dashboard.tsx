import { useEffect, useState } from 'react';
import { supabase } from '@/lib/supabase';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';


export default function AdminDashboard() {
    const [logs, setLogs] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchLogs();

        // Subscribe to realtime changes
        const channel = supabase
            .channel('schema-db-changes')
            .on(
                'postgres_changes',
                {
                    event: 'INSERT',
                    schema: 'public',
                    table: 'user_activities',
                },
                (payload) => {
                    setLogs((current) => [payload.new, ...current].slice(0, 50));
                }
            )
            .subscribe();

        return () => {
            supabase.removeChannel(channel);
        };
    }, []);

    const fetchLogs = async () => {
        try {
            const { data, error } = await supabase
                .from('user_activities')
                .select('*')
                .order('created_at', { ascending: false })
                .limit(50);

            if (data) setLogs(data);
        } catch (e) {
            console.error(e);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="space-y-6">
            <h1 className="text-3xl font-bold text-gray-800">Control Center</h1>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <Card>
                    <CardHeader>
                        <CardTitle>Total Interactions</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="text-4xl font-bold text-blue-600">{logs.length}+</div>
                        <p className="text-sm text-gray-500">Recent activities tracked</p>
                    </CardContent>
                </Card>

                <Card>
                    <CardHeader>
                        <CardTitle>System Status</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="text-xl font-bold text-green-600">Active</div>
                        <p className="text-sm text-gray-500">Monitoring user actions</p>
                    </CardContent>
                </Card>
            </div>

            <Card>
                <CardHeader>
                    <CardTitle>Live Activity Feed</CardTitle>
                </CardHeader>
                <CardContent>
                    {loading ? (
                        <p>Loading activities...</p>
                    ) : (
                        <div className="space-y-4">
                            {logs.map((log) => (
                                <div key={log.id} className="flex items-start p-3 bg-white border rounded shadow-sm">
                                    <div className="bg-blue-100 p-2 rounded mr-3">
                                        <span className="text-xs font-bold text-blue-800">{log.action_type}</span>
                                    </div>
                                    <div>
                                        <p className="text-sm text-gray-800">
                                            {log.user_id ? `User ${log.user_id.slice(0, 6)}...` : 'Anonymous User'}
                                            {' '} performed action on
                                            {' '} {new Date(log.created_at).toLocaleString()}
                                        </p>
                                        <pre className="text-xs text-gray-500 mt-1 bg-gray-50 p-1 rounded overflow-x-auto">
                                            {JSON.stringify(log.details, null, 2)}
                                        </pre>
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}
                </CardContent>
            </Card>
        </div>
    );
}
