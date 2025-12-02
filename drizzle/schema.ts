import { pgTable, index, pgPolicy, uuid, varchar, text, timestamp, unique, foreignKey, check, numeric, integer, jsonb, boolean, date, primaryKey, pgSchema } from "drizzle-orm/pg-core"
import { sql } from "drizzle-orm"

const authSchema = pgSchema("auth");

export const usersInAuth = authSchema.table("users", {
	id: uuid("id").primaryKey(),
});



export const contactMessages = pgTable("contact_messages", {
	id: uuid().default(sql`uuid_generate_v4()`).primaryKey().notNull(),
	name: varchar({ length: 255 }).notNull(),
	email: varchar({ length: 255 }).notNull(),
	subject: varchar({ length: 500 }).notNull(),
	message: text().notNull(),
	status: varchar({ length: 50 }).default('new'),
	createdAt: timestamp("created_at", { withTimezone: true, mode: 'string' }).defaultNow(),
	updatedAt: timestamp("updated_at", { withTimezone: true, mode: 'string' }).defaultNow(),
}, (table) => [
	index("idx_contact_messages_created_at").using("btree", table.createdAt.desc().nullsFirst().op("timestamptz_ops")),
	index("idx_contact_messages_status").using("btree", table.status.asc().nullsLast().op("text_ops")),
	pgPolicy("Allow public insert", { as: "permissive", for: "insert", to: ["public"], withCheck: sql`true` }),
	pgPolicy("Allow admin read", { as: "permissive", for: "select", to: ["public"] }),
	pgPolicy("Anyone can send contact message", { as: "permissive", for: "insert", to: ["public"] }),
	pgPolicy("Admins can view contact messages", { as: "permissive", for: "select", to: ["public"] }),
	pgPolicy("Admins can update contact messages", { as: "permissive", for: "update", to: ["public"] }),
]);

export const settings = pgTable("settings", {
	key: text().primaryKey().notNull(),
	value: text(),
	category: text().notNull(),
	createdAt: timestamp("created_at", { withTimezone: true, mode: 'string' }).defaultNow(),
	updatedAt: timestamp("updated_at", { withTimezone: true, mode: 'string' }).defaultNow(),
}, (table) => [
	pgPolicy("Enable read access for all users", { as: "permissive", for: "select", to: ["public"], using: sql`true` }),
	pgPolicy("Enable all access for authenticated users", { as: "permissive", for: "all", to: ["public"] }),
]);

export const categories = pgTable("categories", {
	id: uuid().default(sql`uuid_generate_v4()`).primaryKey().notNull(),
	name: text().notNull(),
	slug: text().notNull(),
	description: text(),
	icon: text(),
	createdAt: timestamp("created_at", { withTimezone: true, mode: 'string' }).defaultNow(),
	updatedAt: timestamp("updated_at", { withTimezone: true, mode: 'string' }).defaultNow(),
}, (table) => [
	unique("categories_slug_key").on(table.slug),
	pgPolicy("Categories are viewable by everyone", { as: "permissive", for: "select", to: ["public"], using: sql`true` }),
	pgPolicy("Admins can insert categories", { as: "permissive", for: "insert", to: ["public"] }),
	pgPolicy("Admins can update categories", { as: "permissive", for: "update", to: ["public"] }),
	pgPolicy("Admins can delete categories", { as: "permissive", for: "delete", to: ["public"] }),
	pgPolicy("Enable full access for all users", { as: "permissive", for: "all", to: ["public"] }),
]);

export const profiles = pgTable("profiles", {
	id: uuid().primaryKey().notNull(),
	name: text(),
	role: text().default('customer').notNull(),
	about: text(),
	username: text(),
	avatarUrl: text("avatar_url"),
	phone: text(),
	createdAt: timestamp("created_at", { withTimezone: true, mode: 'string' }).defaultNow(),
	updatedAt: timestamp("updated_at", { withTimezone: true, mode: 'string' }).defaultNow(),
}, (table) => [
	foreignKey({
		columns: [table.id],
		foreignColumns: [users.id],
		name: "profiles_id_fkey"
	}),
	unique("profiles_username_key").on(table.username),
	pgPolicy("Public profiles are viewable by everyone", { as: "permissive", for: "select", to: ["public"], using: sql`true` }),
	pgPolicy("Users can update own profile", { as: "permissive", for: "update", to: ["public"] }),
	pgPolicy("Admins can view all profiles", { as: "permissive", for: "select", to: ["public"] }),
	pgPolicy("Admins can update all profiles", { as: "permissive", for: "update", to: ["public"] }),
]);

export const tags = pgTable("tags", {
	id: uuid().default(sql`uuid_generate_v4()`).primaryKey().notNull(),
	name: text().notNull(),
	slug: text().notNull(),
	createdAt: timestamp("created_at", { withTimezone: true, mode: 'string' }).defaultNow(),
}, (table) => [
	unique("tags_name_key").on(table.name),
	unique("tags_slug_key").on(table.slug),
]);

export const destinations = pgTable("destinations", {
	id: uuid().default(sql`uuid_generate_v4()`).primaryKey().notNull(),
	title: text().notNull(),
	slug: text().notNull(),
	description: text(),
	content: text(),
	pricing: numeric({ precision: 10, scale: 2 }).notNull(),
	maxParticipants: integer("max_participants").default(15).notNull(),
	difficulty: text().notNull(),
	categoryId: uuid("category_id"),
	location: text(),
	imageUrl: text("image_url"),
	images: jsonb().default([]),
	featured: boolean().default(false),
	publishedAt: timestamp("published_at", { withTimezone: true, mode: 'string' }),
	createdAt: timestamp("created_at", { withTimezone: true, mode: 'string' }).defaultNow(),
	updatedAt: timestamp("updated_at", { withTimezone: true, mode: 'string' }).defaultNow(),
	deletedAt: timestamp("deleted_at", { withTimezone: true, mode: 'string' }),
	durationDays: text("duration_days").notNull(),
	highlights: text().array(),
	inclusions: text().array(),
	gallery: text().array(),
}, (table) => [
	index("idx_destinations_category").using("btree", table.categoryId.asc().nullsLast().op("uuid_ops")),
	index("idx_destinations_featured").using("btree", table.featured.asc().nullsLast().op("bool_ops")).where(sql`(featured = true)`),
	index("idx_destinations_published").using("btree", table.publishedAt.asc().nullsLast().op("timestamptz_ops")).where(sql`(published_at IS NOT NULL)`),
	foreignKey({
		columns: [table.categoryId],
		foreignColumns: [categories.id],
		name: "destinations_category_id_fkey"
	}).onDelete("set null"),
	unique("destinations_slug_key").on(table.slug),
	pgPolicy("Admins can view all destinations", { as: "permissive", for: "select", to: ["public"], using: sql`is_admin()` }),
	pgPolicy("Admins can insert destinations", { as: "permissive", for: "insert", to: ["public"] }),
	pgPolicy("Admins can delete destinations", { as: "permissive", for: "delete", to: ["public"] }),
	pgPolicy("Admins can update destinations", { as: "permissive", for: "update", to: ["public"] }),
	pgPolicy("Published destinations are viewable by everyone", { as: "permissive", for: "all", to: ["public"] }),
	pgPolicy("Admins can manage all destinations", { as: "permissive", for: "insert", to: ["public"] }),
	pgPolicy("Enable full access for all users", { as: "permissive", for: "all", to: ["public"] }),
	check("destinations_difficulty_check", sql`difficulty = ANY (ARRAY['easy'::text, 'moderate'::text, 'hard'::text])`),
]);

export const blogPosts = pgTable("blog_posts", {
	id: uuid().default(sql`uuid_generate_v4()`).primaryKey().notNull(),
	authorId: uuid("author_id"),
	title: text().notNull(),
	slug: text().notNull(),
	excerpt: text(),
	content: text(),
	imageUrl: text("image_url"),
	category: text(),
	publishedAt: timestamp("published_at", { withTimezone: true, mode: 'string' }),
	createdAt: timestamp("created_at", { withTimezone: true, mode: 'string' }).defaultNow(),
	updatedAt: timestamp("updated_at", { withTimezone: true, mode: 'string' }).defaultNow(),
	deletedAt: timestamp("deleted_at", { withTimezone: true, mode: 'string' }),
}, (table) => [
	index("idx_blog_posts_published").using("btree", table.publishedAt.asc().nullsLast().op("timestamptz_ops")).where(sql`(published_at IS NOT NULL)`),
	foreignKey({
		columns: [table.authorId],
		foreignColumns: [users.id],
		name: "blog_posts_author_id_fkey"
	}).onDelete("set null"),
	unique("blog_posts_slug_key").on(table.slug),
	pgPolicy("Published blog posts are viewable by everyone", { as: "permissive", for: "select", to: ["public"], using: sql`((published_at IS NOT NULL) AND (deleted_at IS NULL))` }),
	pgPolicy("Admins can view all blog posts", { as: "permissive", for: "select", to: ["public"] }),
	pgPolicy("Admins can insert blog posts", { as: "permissive", for: "insert", to: ["public"] }),
	pgPolicy("Admins can update blog posts", { as: "permissive", for: "update", to: ["public"] }),
]);

export const reviews = pgTable("reviews", {
	id: uuid().default(sql`uuid_generate_v4()`).primaryKey().notNull(),
	userId: uuid("user_id"),
	destinationId: uuid("destination_id"),
	bookingId: uuid("booking_id"),
	rating: integer().notNull(),
	title: text(),
	comment: text(),
	verified: boolean().default(false),
	createdAt: timestamp("created_at", { withTimezone: true, mode: 'string' }).defaultNow(),
	updatedAt: timestamp("updated_at", { withTimezone: true, mode: 'string' }).defaultNow(),
}, (table) => [
	index("idx_reviews_destination").using("btree", table.destinationId.asc().nullsLast().op("uuid_ops")),
	foreignKey({
		columns: [table.destinationId],
		foreignColumns: [destinations.id],
		name: "reviews_destination_id_fkey"
	}).onDelete("cascade"),
	foreignKey({
		columns: [table.userId],
		foreignColumns: [users.id],
		name: "reviews_user_id_fkey"
	}).onDelete("cascade"),
	pgPolicy("Reviews are viewable by everyone", { as: "permissive", for: "select", to: ["public"], using: sql`true` }),
	pgPolicy("Users can create reviews for their bookings", { as: "permissive", for: "insert", to: ["public"] }),
	pgPolicy("Allow public read access", { as: "permissive", for: "select", to: ["public"] }),
	pgPolicy("Allow authenticated insert", { as: "permissive", for: "insert", to: ["public"] }),
	pgPolicy("Allow users to update own reviews", { as: "permissive", for: "update", to: ["public"] }),
	pgPolicy("Allow users to delete own reviews", { as: "permissive", for: "delete", to: ["public"] }),
	check("reviews_rating_check", sql`(rating >= 1) AND (rating <= 5)`),
]);

export const siteSettings = pgTable("site_settings", {
	id: uuid().default(sql`uuid_generate_v4()`).primaryKey().notNull(),
	key: text().notNull(),
	value: jsonb(),
	createdAt: timestamp("created_at", { withTimezone: true, mode: 'string' }).defaultNow(),
	updatedAt: timestamp("updated_at", { withTimezone: true, mode: 'string' }).defaultNow(),
}, (table) => [
	unique("site_settings_key_key").on(table.key),
	pgPolicy("Admins can view site settings", { as: "permissive", for: "select", to: ["public"], using: sql`is_admin()` }),
	pgPolicy("Admins can update site settings", { as: "permissive", for: "update", to: ["public"] }),
	pgPolicy("Admins can insert site settings", { as: "permissive", for: "insert", to: ["public"] }),
]);

export const pageContents = pgTable("page_contents", {
	id: uuid().defaultRandom().primaryKey().notNull(),
	pageSlug: text("page_slug").notNull(),
	sectionKey: text("section_key").notNull(),
	content: jsonb().notNull(),
	createdAt: timestamp("created_at", { withTimezone: true, mode: 'string' }).defaultNow(),
	updatedAt: timestamp("updated_at", { withTimezone: true, mode: 'string' }).defaultNow(),
}, (table) => [
	unique("page_contents_page_slug_section_key_key").on(table.pageSlug, table.sectionKey),
	pgPolicy("Enable read access for all users", { as: "permissive", for: "select", to: ["public"], using: sql`true` }),
	pgPolicy("Enable insert for authenticated users only", { as: "permissive", for: "insert", to: ["public"] }),
	pgPolicy("Enable update for authenticated users only", { as: "permissive", for: "update", to: ["public"] }),
	pgPolicy("Admin Can View", { as: "permissive", for: "select", to: ["public"] }),
]);

export const media = pgTable("media", {
	id: uuid().default(sql`uuid_generate_v4()`).primaryKey().notNull(),
	filename: text().notNull(),
	originalFilename: text("original_filename").notNull(),
	filePath: text("file_path").notNull(),
	fileSize: integer("file_size").notNull(),
	mimeType: text("mime_type").notNull(),
	uploadedBy: uuid("uploaded_by"),
	createdAt: timestamp("created_at", { withTimezone: true, mode: 'string' }).defaultNow(),
}, (table) => [
	foreignKey({
		columns: [table.uploadedBy],
		foreignColumns: [users.id],
		name: "media_uploaded_by_fkey"
	}).onDelete("set null"),
	pgPolicy("Admins can view all media", {
		as: "permissive", for: "select", to: ["public"], using: sql`(EXISTS ( SELECT 1
   FROM profiles
  WHERE ((profiles.id = auth.uid()) AND (profiles.role = 'admin'::text))))` }),
	pgPolicy("Admins can insert media", { as: "permissive", for: "insert", to: ["public"] }),
	pgPolicy("Admins can delete media", { as: "permissive", for: "delete", to: ["public"] }),
]);

export const bookings = pgTable("bookings", {
	id: uuid().default(sql`uuid_generate_v4()`).primaryKey().notNull(),
	userId: uuid("user_id").default(sql`auth.uid()`).notNull(),
	destinationId: uuid("destination_id").notNull(),
	bookingNumber: text("booking_number"),
	startDate: date("start_date").notNull(),
	endDate: date("end_date"),
	participants: integer().default(1).notNull(),
	totalPrice: numeric("total_price", { precision: 10, scale: 2 }).notNull(),
	status: text().default('pending').notNull(),
	paymentStatus: text("payment_status").default('unpaid').notNull(),
	paymentMethod: text("payment_method"),
	paymentId: text("payment_id"),
	specialRequests: text("special_requests"),
	customerName: text("customer_name").notNull(),
	customerPhone: text("customer_phone").notNull(),
	createdAt: timestamp("created_at", { withTimezone: true, mode: 'string' }).defaultNow(),
	updatedAt: timestamp("updated_at", { withTimezone: true, mode: 'string' }).defaultNow(),
	notes: text(),
}, (table) => [
	index("idx_bookings_destination").using("btree", table.destinationId.asc().nullsLast().op("uuid_ops")),
	index("idx_bookings_status").using("btree", table.status.asc().nullsLast().op("text_ops")),
	index("idx_bookings_user").using("btree", table.userId.asc().nullsLast().op("uuid_ops")),
	foreignKey({
		columns: [table.destinationId],
		foreignColumns: [destinations.id],
		name: "bookings_destination_id_fkey"
	}).onDelete("cascade"),
	foreignKey({
		columns: [table.userId],
		foreignColumns: [users.id],
		name: "bookings_user_id_fkey"
	}).onDelete("cascade"),
	unique("bookings_booking_number_key").on(table.bookingNumber),
	pgPolicy("Users can create their own bookings", { as: "permissive", for: "insert", to: ["authenticated"], withCheck: sql`(auth.uid() = user_id)` }),
	pgPolicy("Users can view their own bookings", { as: "permissive", for: "select", to: ["authenticated"] }),
	pgPolicy("Admins can update bookings", { as: "permissive", for: "update", to: ["public"] }),
	pgPolicy("Admins can delete bookings", { as: "permissive", for: "delete", to: ["public"] }),
	pgPolicy("Admins can view all bookings", { as: "permissive", for: "select", to: ["public"] }),
	pgPolicy("Users can view own bookings", { as: "permissive", for: "select", to: ["public"] }),
	check("bookings_payment_status_check", sql`payment_status = ANY (ARRAY['unpaid'::text, 'paid'::text, 'refunded'::text])`),
	check("bookings_status_check", sql`status = ANY (ARRAY['pending'::text, 'paid'::text, 'confirmed'::text, 'completed'::text, 'cancelled'::text])`),
]);

export const users = pgTable("users", {
	id: uuid().primaryKey().notNull(),
	fullName: text("full_name"),
	phone: text(),
	createdAt: timestamp("created_at", { withTimezone: true, mode: 'string' }).defaultNow(),
	updatedAt: timestamp("updated_at", { withTimezone: true, mode: 'string' }).defaultNow(),
}, (table) => [
	foreignKey({
		columns: [table.id],
		foreignColumns: [table.id],
		name: "users_id_fkey"
	}).onDelete("cascade"),
]);

export const destinationTags = pgTable("destination_tags", {
	destinationId: uuid("destination_id").notNull(),
	tagId: uuid("tag_id").notNull(),
}, (table) => [
	foreignKey({
		columns: [table.destinationId],
		foreignColumns: [destinations.id],
		name: "destination_tags_destination_id_fkey"
	}).onDelete("cascade"),
	foreignKey({
		columns: [table.tagId],
		foreignColumns: [tags.id],
		name: "destination_tags_tag_id_fkey"
	}).onDelete("cascade"),
	primaryKey({ columns: [table.destinationId, table.tagId], name: "destination_tags_pkey" }),
]);
