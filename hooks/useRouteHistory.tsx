import { useRouter } from "next/router";
import { useEffect, useState } from "react";

export default function useRouteHistory() {
    const router = useRouter();
    const [routes, setRoutes] = useState({
        old: null,
        new: router.route,
    });

    useEffect(() => {
        const handler = (url: string) => {
            console.log(url)
            console.log(routes.old, routes.new)
            setRoutes(prev => ({
                old: prev.new,
                new: url,
            }));
        };
        router.events.on('beforeHistoryChange', handler);
        return () => {
            router.events.off('beforeHistoryChange', handler);
        }
    }, []);

    return [routes.old, routes.new];
}