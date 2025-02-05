import { useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

export const useCommentManagement = (userId?: string) => {
  const saveComment = async (questionId: number, comment: string) => {
    if (!userId) return;

    const { error } = await supabase
      .from('prediction_comments')
      .upsert({
        user_id: userId,
        question_id: questionId,
        comment: comment
      }, {
        onConflict: 'user_id,question_id'
      });

    if (error) throw error;
  };

  return {
    saveComment
  };
};