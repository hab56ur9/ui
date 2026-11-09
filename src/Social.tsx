import { useState, type ReactNode } from "react";
import { Icon } from "./Icon";
import { useI18n } from "./i18n";
import { Image, type ImageProps } from "./Image";

export type AvatarProps = { name: string; src?: string; size?: "sm" | "md" | "lg"; ring?: "new" | "seen" };

export function Avatar({ name, src, size = "md", ring }: AvatarProps) {
  const initials = name.trim().slice(0, 1).toUpperCase();
  return (
    <span className={`avatar is-${size}${ring ? ` has-ring is-${ring}` : ""}`}>
      {src ? <img src={src} alt={name} /> : <span role="img" aria-label={name}>{initials}</span>}
    </span>
  );
}

export type StoryItem = { id: string; name: string; src?: string; seen?: boolean };
export type StoriesProps = { items: StoryItem[]; onSelect?: (id: string) => void; label?: string };

export function Stories({ items, onSelect, label }: StoriesProps) {
  const { text } = useI18n();
  return (
    <ul className="stories" aria-label={label ?? text("stories")}>
      {items.map(({ id, name, src, seen }) => (
        <li key={id}>
          <button type="button" className="story" onClick={() => onSelect?.(id)}>
            <Avatar name={name} src={src} size="lg" ring={seen ? "seen" : "new"} />
            <span className="story-name">{name}</span>
          </button>
        </li>
      ))}
    </ul>
  );
}

export type PostProps = {
  author: string;
  avatar?: string;
  place?: string;
  photo: ImageProps;
  likes: number;
  liked?: boolean;
  caption?: string;
  comments?: number;
  time?: string;
  onLike?: (liked: boolean) => void;
  onComment?: () => void;
  onShare?: () => void;
  onSave?: () => void;
};

export function Post({ author, avatar, place, photo, likes, liked: initial = false, caption, comments, time, onLike, onComment, onShare, onSave }: PostProps) {
  const { locale, text } = useI18n();
  const [liked, setLiked] = useState(initial);
  const count = new Intl.NumberFormat(locale).format(likes + Number(liked) - Number(initial));
  const like = () => {
    setLiked(!liked);
    onLike?.(!liked);
  };
  return (
    <article className="post">
      <header className="post-head">
        <Avatar name={author} src={avatar} size="sm" />
        <div className="post-author">
          <strong>{author}</strong>
          {place && <span>{place}</span>}
        </div>
      </header>
      <div onDoubleClick={() => liked || like()}>
        <Image {...photo} ratio={photo.ratio ?? "3:4"} />
      </div>
      <div className="post-actions">
        <button type="button" className={`post-action${liked ? " is-on" : ""}`} aria-pressed={liked} aria-label={text("like")} title={text("like")} onClick={like}>
          <Icon name="heart" />
        </button>
        <button type="button" className="post-action" aria-label={text("comment")} title={text("comment")} onClick={onComment}>
          <Icon name="message" />
        </button>
        <button type="button" className="post-action" aria-label={text("share")} title={text("share")} onClick={onShare}>
          <Icon name="send" />
        </button>
        <span className="toolbar-spacer" />
        <button type="button" className="post-action" aria-label={text("save")} title={text("save")} onClick={onSave}>
          <Icon name="bookmark" />
        </button>
      </div>
      <div className="post-text">
        <strong>{text("likes", { n: count })}</strong>
        {caption && (
          <p>
            <strong>{author}</strong> {caption}
          </p>
        )}
        {comments ? (
          <button type="button" className="post-more" onClick={onComment}>
            {text("comments", { n: new Intl.NumberFormat(locale).format(comments) })}
          </button>
        ) : null}
        {time && <span className="post-time">{time}</span>}
      </div>
    </article>
  );
}

export type ProfileStat = { label: string; value: string | number };
export type ProfileHeaderProps = { name: string; handle?: string; avatar?: string; bio?: string; stats?: ProfileStat[]; children?: ReactNode };

export function ProfileHeader({ name, handle, avatar, bio, stats = [], children }: ProfileHeaderProps) {
  const { locale } = useI18n();
  return (
    <header className="profile">
      <div className="profile-top">
        <Avatar name={name} src={avatar} size="lg" />
        <dl className="profile-stats">
          {stats.map(({ label, value }) => (
            <div key={label}>
              <dd>{typeof value === "number" ? new Intl.NumberFormat(locale, { notation: "compact" }).format(value) : value}</dd>
              <dt>{label}</dt>
            </div>
          ))}
        </dl>
      </div>
      <div className="profile-text">
        <strong>{name}</strong>
        {handle && <span>{handle}</span>}
        {bio && <p>{bio}</p>}
      </div>
      {children && <div className="profile-actions">{children}</div>}
    </header>
  );
}

export type GridPhoto = ImageProps & { id: string };
export type PhotoGridProps = { items: GridPhoto[]; onSelect?: (id: string) => void };

export function PhotoGrid({ items, onSelect }: PhotoGridProps) {
  return (
    <ul className="photo-grid">
      {items.map(({ id, ...photo }) => (
        <li key={id}>
          <button type="button" onClick={() => onSelect?.(id)}>
            <Image {...photo} ratio="1:1" />
          </button>
        </li>
      ))}
    </ul>
  );
}

export type ListItem = { id: string; title: string; description?: string; avatar?: string; meta?: string };
export type ListProps = { items: ListItem[]; onSelect?: (id: string) => void; label?: string };

export function List({ items, onSelect, label }: ListProps) {
  return (
    <ul className="list" aria-label={label}>
      {items.map(({ id, title, description, avatar, meta }) => (
        <li key={id}>
          <button type="button" className="list-item" onClick={() => onSelect?.(id)}>
            {avatar && <Avatar name={avatar} size="sm" />}
            <span className="list-text">
              <strong>{title}</strong>
              {description && <span>{description}</span>}
            </span>
            {meta && <span className="list-meta">{meta}</span>}
          </button>
        </li>
      ))}
    </ul>
  );
}
