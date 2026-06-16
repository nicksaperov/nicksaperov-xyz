import { db } from '@/lib/firebase/config';
import { collection, getDocs } from 'firebase/firestore';

export default async function sitemap() {
    // Defines your canonical production domain
    const baseUrl = 'https://nicksaperov.xyz';
    
    // 1. Establish static priority routes
    const staticRoutes = [
        {
            url: baseUrl,
            lastModified: new Date(),
            changeFrequency: 'weekly',
            priority: 1.0,
        }
    ];

    try {
        // 2. Fetch all Protocol/Project deployments
        const projectsRef = collection(db, 'artifacts', 'nicksaperov-portfolio', 'public', 'data', 'projects');
        const projectsSnap = await getDocs(projectsRef);
        
        const projectRoutes = projectsSnap.docs.map((doc) => ({
            url: `${baseUrl}/projects/${doc.id}`,
            lastModified: new Date(), 
            changeFrequency: 'monthly',
            priority: 0.8,
        }));

        // 3. Fetch all Strategic Articles
        const articlesRef = collection(db, 'artifacts', 'nicksaperov-portfolio', 'public', 'data', 'articles');
        const articlesSnap = await getDocs(articlesRef);
        
        const articleRoutes = articlesSnap.docs.map((doc) => {
            const data = doc.data();
            // If the article has a published date string, map it. Otherwise fallback to current date.
            const lastMod = data.date ? new Date(data.date) : new Date();
            
            return {
                url: `${baseUrl}/articles/${doc.id}`,
                lastModified: lastMod,
                changeFrequency: 'yearly',
                priority: 0.7,
            };
        });

        // 4. Return the consolidated routing payload
        return [...staticRoutes, ...projectRoutes, ...articleRoutes];

    } catch (error) {
        console.error("Sitemap Uplink Failed:", error);
        // Fail-safe: Ensure the static site map still generates if the database goes down
        return staticRoutes; 
    }
}