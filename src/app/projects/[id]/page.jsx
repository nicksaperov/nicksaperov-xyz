import { notFound } from 'next/navigation';
import { db } from '@/lib/firebase/config';
import { doc, getDoc } from 'firebase/firestore';

// 1. Dynamic Metadata API for SEO & Social Sharing
export async function generateMetadata({ params }) {
    // FIX: Await the params Promise before destructuring
    const { id } = await params;

    try {
        const docRef = doc(db, 'artifacts', 'nicksaperov-portfolio', 'public', 'data', 'projects', id);
        const docSnap = await getDoc(docRef);

        if (!docSnap.exists()) {
            return { title: 'Project Not Found | Nick Saperov' };
        }

        const project = docSnap.data();

        return {
            title: `${project.title} | Nick Saperov Architecture`,
            description: project.descEn,
            openGraph: {
                title: project.title,
                description: project.descEn,
                type: 'article',
            }
        };
    } catch (error) {
        console.error("Metadata Uplink Failed:", error);
        return { title: 'Architecture | Nick Saperov' };
    }
}

// 2. Server-Side Rendered Page Component
export default async function ProjectPage({ params, searchParams }) {
    // FIX: Await both Next.js 15 async routing objects
    const { id } = await params;
    const resolvedSearchParams = await searchParams;
    
    const lang = resolvedSearchParams?.lang || 'en'; 

    let project = null;

    try {
        const docRef = doc(db, 'artifacts', 'nicksaperov-portfolio', 'public', 'data', 'projects', id);
        const docSnap = await getDoc(docRef);

        if (!docSnap.exists()) {
            notFound(); 
        }

        project = { id: docSnap.id, ...docSnap.data() };
    } catch (error) {
        console.error("Database Fetch Error:", error);
        return <div className="text-red-400 p-8">Critical Error: System state could not be loaded.</div>;
    }

    const t = (enText, ruText) => lang === 'en' ? enText : ruText;

    return (
        <article className="max-w-4xl mx-auto bg-[#11111a] border border-gray-800 rounded-xl p-6 md:p-10 shadow-2xl mt-24 text-white">
            <header className="mb-10 pb-10 border-b border-gray-800">
                <div className="flex items-center gap-4 mb-6">
                    <div className={`w-16 h-16 rounded-xl bg-${project.color}-500/10 text-${project.color}-400 flex items-center justify-center text-3xl`}>
                        <i className={project.icon}></i>
                    </div>
                    <h1 className="text-3xl md:text-5xl font-bold tracking-tight">
                        {project.title}
                    </h1>
                </div>
                
                <div className="flex flex-wrap items-center gap-4 text-sm font-mono text-gray-400">
                    <span className="bg-cyan-500/10 text-cyan-400 px-3 py-1 rounded-full border border-cyan-500/20">
                        {t(project.tagEn, project.tagRu)}
                    </span>
                    {project.liveLink && (
                        <a href={project.liveLink} target="_blank" rel="noopener noreferrer" className="hover:text-cyan-400 transition-colors">
                            <i className="fa-solid fa-link mr-2"></i>Live Deployment
                        </a>
                    )}
                </div>
            </header>

            <div 
                className="prose prose-invert prose-cyan max-w-none prose-p:text-gray-300 prose-headings:text-white"
                dangerouslySetInnerHTML={{ __html: t(project.contentEn, project.contentRu) }}
            />
        </article>
    );
}