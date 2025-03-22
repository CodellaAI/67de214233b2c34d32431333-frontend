
import { Clock, Download, FileText } from 'lucide-react'
import { formatDistanceToNow } from 'date-fns'

export default function PluginVersionHistory({ versions }) {
  if (!versions || versions.length === 0) {
    return (
      <div className="text-center py-8">
        <FileText size={48} className="mx-auto text-gray-400 mb-4" />
        <h3 className="text-lg font-medium text-gray-900 mb-1">No version history available</h3>
        <p className="text-gray-500">This plugin doesn't have any recorded versions yet.</p>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <h2 className="text-xl font-bold mb-4">Version History</h2>
      
      <div className="space-y-6">
        {versions.map((version, index) => (
          <div key={index} className="border-l-4 border-primary-500 pl-4">
            <div className="flex flex-wrap justify-between items-start gap-2">
              <div>
                <h3 className="text-lg font-semibold">
                  Version {version.versionNumber}
                  {index === 0 && (
                    <span className="ml-2 text-xs font-medium bg-primary-100 text-primary-800 py-1 px-2 rounded-full">
                      Latest
                    </span>
                  )}
                </h3>
                
                <div className="flex items-center text-sm text-gray-500 mt-1">
                  <Clock size={14} className="mr-1" />
                  <span>
                    Released {formatDistanceToNow(new Date(version.createdAt), { addSuffix: true })}
                  </span>
                  
                  {version.downloads && (
                    <>
                      <span className="mx-2">•</span>
                      <Download size={14} className="mr-1" />
                      <span>{version.downloads} downloads</span>
                    </>
                  )}
                </div>
              </div>
              
              <button className="btn btn-outline text-sm py-1">
                <Download size={16} className="mr-1" />
                Download
              </button>
            </div>
            
            {version.changelog && (
              <div className="mt-3 prose prose-sm max-w-none">
                <h4 className="text-sm font-medium text-gray-900 mb-1">Changelog:</h4>
                <div className="text-gray-700" dangerouslySetInnerHTML={{ __html: version.changelog }}></div>
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  )
}
