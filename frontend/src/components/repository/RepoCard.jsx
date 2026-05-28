import { Link } from "react-router-dom";
import { GitBranch, Lock, Globe, Star } from "lucide-react";
import truncate from "../../utils/truncate.js";
import { formatDate } from "../../utils/formatDate.js";

const RepoCard = ({ repo }) => {
  return (
    <Link
      to={`/repos/${repo._id}`}
      className="block bg-[#161b22] border border-[#30363d] rounded-xl p-5 hover:border-blue-500/50 hover:shadow-lg hover:shadow-blue-500/5 transition-all"
    >
      <div className="flex items-start justify-between gap-3">
        <div className="flex items-center gap-2 min-w-0">
          <GitBranch className="w-5 h-5 text-blue-400 flex-shrink-0" />

          <div className="min-w-0">
            <h3 className="text-base font-semibold text-gray-100 truncate">
              {repo.name}
            </h3>

            {repo.owner?.username && (
              <p className="text-xs text-gray-500 mt-0.5">
                by {repo.owner.username}
              </p>
            )}
          </div>
        </div>

        <span
          className={`flex items-center gap-1 text-xs px-2 py-0.5 rounded-full border ${repo.visibility === "private"
            ? "bg-yellow-500/10 text-yellow-400 border-yellow-500/20"
            : "bg-green-500/10 text-green-400 border-green-500/20"
            }`}
        >
          {repo.visibility === "private" ? (
            <Lock className="w-3 h-3" />
          ) : (
            <Globe className="w-3 h-3" />
          )}

          {repo.visibility}
        </span>
      </div>

      {repo.description && (
        <p className="mt-3 text-sm text-gray-400 leading-relaxed">
          {truncate(repo.description, 100)}
        </p>
      )}

      <div className="mt-4 flex items-center gap-4 text-xs text-gray-500">
        <span className="flex items-center gap-1">
          <Star className="w-3 h-3" />
          {repo.contributors?.length || 0} contributors
        </span>

        <span>
          Updated {formatDate(repo.updatedAt)}
        </span>
      </div>
    </Link>
  );
};

export default RepoCard;