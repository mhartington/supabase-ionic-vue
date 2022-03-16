import { User } from "@supabase/supabase-js"
import { reactive } from "vue"

export const store = reactive<{user: User | Record<string, unknown>}>({
  user: {},
})
