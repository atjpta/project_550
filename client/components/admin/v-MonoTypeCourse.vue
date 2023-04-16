<template>
    <div
        class="w-full duration-500 hover:bg-gradient-to-r from-indigo-500/10 via-purple-500/10 to-pink-500/10 p-3 rounded-2xl">
        <div class="flex justify-between items-center">
            <!-- tiêu đề -->
            <div class="text-left w-full ml-5">
                {{ data.name }}
            </div>

            <!-- các nút chức năng -->
            <div class="grid grid-cols-2 lg:grid-cols-4 gap-5 pr-5">
                <div data-tip="chỉnh kiểu môn học" class="uppercase font-medium flex tooltip tooltip-left lg:tooltip-top">
                    <div @click="openDialogEdit()" class="h-10 w-10 btn btn-sm btn-ghost text-primary">
                        <OtherVIcon icon="fa-solid fa-edit" />
                    </div>
                </div>
                <div data-tip="xóa kiểu môn học" class="uppercase font-medium flex tooltip tooltip-left lg:tooltip-top">
                    <div @click="openDialogDelete()" class="h-10 w-10 btn btn-sm btn-ghost text-error">
                        <OtherVIcon icon="fa-solid fa-trash" />
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>

<script setup>
import { alertStore } from "~/stores/alert.store";
import { routeStore } from "~/stores/route.store";
import { typecourseStore } from "~/stores/typecourse.store";
import { dialogStore } from "~~/stores/dialog.store";

const props = defineProps({
    data: Object,
});
const useDialog = dialogStore();
const useRouteS = routeStore();
const useTypeCourse = typecourseStore();
const useAlert = alertStore();
function openDialogEdit() {
    useDialog.showDialogInput(
        {
            title: "chỉnh sửa loại môn học",
            content: "nhập lại tên loại môn học",
            btn1: "tạo",
            btn2: "hủy",
            input: props.data.name,
        },
        async (input) => {
            try {
                await useTypeCourse.update({
                    id: props.data.id,
                    name: input,
                });
                await useRouteS.refreshData();

                useAlert.setSuccess("sửa thành công");
            } catch (error) {
                console.log(error);
                useAlert.setError("lỗi server");
            }
        }
    );
}

function openDialogDelete() {
    useDialog.showDialog(
        {
            title: "Thông báo cực căng!",
            content: "bạn chắc chắn muốn xóa loại môn học này này",
            btn1: "ok",
            btn2: "hủy",
        },
        async () => {
            try {
                await useTypeCourse.deleteOne(props.data.id);
                useRouteS.refreshData(1);
            } catch (error) {
                console.log(error);
            }
        }
    );
}
</script>
