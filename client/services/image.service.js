import { alertStore } from "~~/stores/alert.store";
const useAlert = alertStore()
const supabase = useSupabaseClient()
export default {
    upload: async (filePath, file) => {
        let { error: uploadError } = await supabase.storage
            .from("blog-files/image")
            .upload(filePath, file);
        if (uploadError?.statusCode == 409) {
            return
        }
        else if (uploadError) {
            useAlert.setError(" lỗi upload ảnh: " + uploadError?.message);
            throw uploadError;
        }

        // useAlert.setSuccess("tải ảnh lên thành công");
        return;
    },

} 