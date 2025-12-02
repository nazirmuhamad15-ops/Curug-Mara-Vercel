import { relations } from "drizzle-orm/relations";
import { usersInAuth, profiles, categories, destinations, blogPosts, reviews, media, bookings, users, destinationTags, tags } from "./schema";

export const profilesRelations = relations(profiles, ({one}) => ({
	usersInAuth: one(usersInAuth, {
		fields: [profiles.id],
		references: [usersInAuth.id]
	}),
}));

export const usersInAuthRelations = relations(usersInAuth, ({many}) => ({
	profiles: many(profiles),
	blogPosts: many(blogPosts),
	reviews: many(reviews),
	media: many(media),
	bookings: many(bookings),
	users: many(users),
}));

export const destinationsRelations = relations(destinations, ({one, many}) => ({
	category: one(categories, {
		fields: [destinations.categoryId],
		references: [categories.id]
	}),
	reviews: many(reviews),
	bookings: many(bookings),
	destinationTags: many(destinationTags),
}));

export const categoriesRelations = relations(categories, ({many}) => ({
	destinations: many(destinations),
}));

export const blogPostsRelations = relations(blogPosts, ({one}) => ({
	usersInAuth: one(usersInAuth, {
		fields: [blogPosts.authorId],
		references: [usersInAuth.id]
	}),
}));

export const reviewsRelations = relations(reviews, ({one}) => ({
	destination: one(destinations, {
		fields: [reviews.destinationId],
		references: [destinations.id]
	}),
	usersInAuth: one(usersInAuth, {
		fields: [reviews.userId],
		references: [usersInAuth.id]
	}),
}));

export const mediaRelations = relations(media, ({one}) => ({
	usersInAuth: one(usersInAuth, {
		fields: [media.uploadedBy],
		references: [usersInAuth.id]
	}),
}));

export const bookingsRelations = relations(bookings, ({one}) => ({
	destination: one(destinations, {
		fields: [bookings.destinationId],
		references: [destinations.id]
	}),
	usersInAuth: one(usersInAuth, {
		fields: [bookings.userId],
		references: [usersInAuth.id]
	}),
}));

export const usersRelations = relations(users, ({one}) => ({
	usersInAuth: one(usersInAuth, {
		fields: [users.id],
		references: [usersInAuth.id]
	}),
}));

export const destinationTagsRelations = relations(destinationTags, ({one}) => ({
	destination: one(destinations, {
		fields: [destinationTags.destinationId],
		references: [destinations.id]
	}),
	tag: one(tags, {
		fields: [destinationTags.tagId],
		references: [tags.id]
	}),
}));

export const tagsRelations = relations(tags, ({many}) => ({
	destinationTags: many(destinationTags),
}));