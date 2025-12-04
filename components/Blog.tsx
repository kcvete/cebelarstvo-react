import React from 'react';
import { ArrowLeft, Calendar, Clock, User } from 'lucide-react';
import { BlogPost } from '../types';
import { BLOG_POSTS } from '../constants';

interface BlogListProps {
  onSelectPost: (post: BlogPost) => void;
}

interface BlogPostViewProps {
  post: BlogPost;
  onBack: () => void;
}

export const BlogList: React.FC<BlogListProps> = ({ onSelectPost }) => {
  return (
    <div className="py-16 bg-gradient-to-b from-amber-50/50 to-white min-h-screen">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-16">
          <span className="text-gold-600 font-medium uppercase tracking-wider text-sm">Naš Blog</span>
          <h1 className="text-4xl md:text-5xl font-bold font-serif text-stone-900 mt-3 mb-4">
            Zgodbe iz panja
          </h1>
          <p className="text-stone-600 max-w-2xl mx-auto text-lg">
            Odkrijte skrivnosti čebelarstva, zdravstvene koristi medu in recepte iz naše kuhinje.
          </p>
        </div>

        {/* Blog Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {BLOG_POSTS.map((post) => (
            <article 
              key={post.id}
              onClick={() => onSelectPost(post)}
              className="bg-white rounded-2xl overflow-hidden shadow-sm border border-stone-100 hover:shadow-xl hover:border-gold-200 transition-all duration-300 cursor-pointer group"
            >
              {/* Image */}
              <div className="relative h-48 overflow-hidden">
                <img 
                  src={post.image} 
                  alt={post.title}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                />
                <div className="absolute top-4 left-4">
                  <span className="bg-gold-500 text-white text-xs font-medium px-3 py-1 rounded-full">
                    {post.category}
                  </span>
                </div>
              </div>

              {/* Content */}
              <div className="p-6">
                <div className="flex items-center gap-4 text-sm text-stone-500 mb-3">
                  <span className="flex items-center gap-1">
                    <Calendar className="w-4 h-4" />
                    {post.date}
                  </span>
                  <span className="flex items-center gap-1">
                    <Clock className="w-4 h-4" />
                    {post.readTime}
                  </span>
                </div>

                <h2 className="text-xl font-bold font-serif text-stone-900 mb-2 group-hover:text-gold-600 transition-colors">
                  {post.title}
                </h2>

                <p className="text-stone-600 text-sm line-clamp-3 mb-4">
                  {post.excerpt}
                </p>

                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 bg-gold-100 rounded-full flex items-center justify-center">
                    <User className="w-4 h-4 text-gold-600" />
                  </div>
                  <span className="text-sm font-medium text-stone-700">{post.author}</span>
                </div>
              </div>
            </article>
          ))}
        </div>
      </div>
    </div>
  );
};

export const BlogPostView: React.FC<BlogPostViewProps> = ({ post, onBack }) => {
  return (
    <div className="py-16 bg-gradient-to-b from-amber-50/50 to-white min-h-screen">
      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Back Button */}
        <button 
          onClick={onBack}
          className="flex items-center gap-2 text-stone-600 hover:text-gold-600 transition-colors mb-8"
        >
          <ArrowLeft className="w-5 h-5" />
          <span>Nazaj na blog</span>
        </button>

        {/* Article Header */}
        <article>
          <div className="mb-8">
            <span className="bg-gold-500 text-white text-sm font-medium px-4 py-1.5 rounded-full">
              {post.category}
            </span>
          </div>

          <h1 className="text-3xl md:text-4xl font-bold font-serif text-stone-900 mb-6">
            {post.title}
          </h1>

          <div className="flex items-center gap-6 text-stone-500 mb-8 pb-8 border-b border-stone-200">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-gold-100 rounded-full flex items-center justify-center">
                <User className="w-5 h-5 text-gold-600" />
              </div>
              <span className="font-medium text-stone-700">{post.author}</span>
            </div>
            <span className="flex items-center gap-1">
              <Calendar className="w-4 h-4" />
              {post.date}
            </span>
            <span className="flex items-center gap-1">
              <Clock className="w-4 h-4" />
              {post.readTime}
            </span>
          </div>

          {/* Featured Image */}
          <div className="rounded-2xl overflow-hidden mb-10">
            <img 
              src={post.image} 
              alt={post.title}
              className="w-full h-64 md:h-80 object-cover"
            />
          </div>

          {/* Article Content */}
          <div 
            className="prose prose-lg prose-stone max-w-none
              prose-headings:font-serif prose-headings:text-stone-900
              prose-p:text-stone-700 prose-p:leading-relaxed
              prose-a:text-gold-600 prose-a:no-underline hover:prose-a:underline
              prose-strong:text-stone-900
              prose-blockquote:border-gold-500 prose-blockquote:bg-amber-50 prose-blockquote:py-4 prose-blockquote:px-6 prose-blockquote:rounded-r-lg prose-blockquote:not-italic
            "
            dangerouslySetInnerHTML={{ __html: post.content }}
          />

          {/* Author Bio */}
          <div className="mt-12 p-6 bg-amber-50 rounded-2xl border border-gold-100">
            <div className="flex items-start gap-4">
              <div className="w-16 h-16 bg-gold-200 rounded-full flex items-center justify-center flex-shrink-0">
                <User className="w-8 h-8 text-gold-600" />
              </div>
              <div>
                <h3 className="font-bold text-stone-900 mb-1">{post.author}</h3>
                <p className="text-stone-600 text-sm">
                  Čebelar z dolgoletnimi izkušnjami iz Vipavske doline. Strasten zagovornik trajnostnega čebelarstva in naravnih metod pridelave medu.
                </p>
              </div>
            </div>
          </div>
        </article>
      </div>
    </div>
  );
};
