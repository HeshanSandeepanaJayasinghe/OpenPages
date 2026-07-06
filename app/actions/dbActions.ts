"use server";

import * as db from "@/lib/db";

export async function actionIsSupabaseConfigured() {
  return db.isSupabaseConfigured();
}

export async function actionGetProfiles() {
  return db.getProfiles();
}

export async function actionGetProfileById(id: string) {
  return db.getProfileById(id);
}

export async function actionGetProfileByEmail(email: string) {
  return db.getProfileByEmail(email);
}

export async function actionCreateProfile(profile: db.Profile) {
  return db.createProfile(profile);
}

export async function actionUpdateProfile(id: string, updates: Partial<db.Profile>) {
  return db.updateProfile(id, updates);
}

export async function actionDeleteProfile(id: string) {
  return db.deleteProfile(id);
}

export async function actionGetPages() {
  return db.getPages();
}

export async function actionGetPageById(id: string) {
  return db.getPageById(id);
}

export async function actionCreatePage(page: db.Page) {
  return db.createPage(page);
}

export async function actionUpdatePage(id: string, updates: Partial<db.Page>) {
  return db.updatePage(id, updates);
}

export async function actionDeletePage(id: string) {
  return db.deletePage(id);
}

export async function actionGetComments(pageId?: string) {
  return db.getComments(pageId);
}

export async function actionCreateComment(comment: db.Comment) {
  return db.createComment(comment);
}

export async function actionDeleteComment(id: string) {
  return db.deleteComment(id);
}

export async function actionGetModerationLogs() {
  return db.getModerationLogs();
}

export async function actionCreateModerationLog(log: db.ModerationLog) {
  return db.createModerationLog(log);
}
