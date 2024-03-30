<template>
  <div class="app-container">
    <el-form :model="queryParams" ref="queryForm" size="small" :inline="true" v-show="showSearch" label-width="68px">
      <el-form-item label="员工名称" prop="staffname">
        <el-input
          v-model="queryParams.staffname"
          placeholder="请输入员工名称"
          clearable
          @keyup.enter.native="handleQuery"
        />
      </el-form-item>
      <el-form-item label="入职年限" prop="years">
        <el-input
          v-model="queryParams.years"
          placeholder="请输入入职年限"
          clearable
          @keyup.enter.native="handleQuery"
        />
      </el-form-item>
      <el-form-item label="入职部门" prop="dept">
        <el-input
          v-model="queryParams.dept"
          placeholder="请输入入职部门"
          clearable
          @keyup.enter.native="handleQuery"
        />
      </el-form-item>

      <el-form-item>
        <el-button type="primary" icon="el-icon-search" size="mini" @click="handleQuery">搜索</el-button>
        <el-button icon="el-icon-refresh" size="mini" @click="resetQuery">重置</el-button>
      </el-form-item>
    </el-form>

    <el-row :gutter="10" class="mb8">
      <el-col :span="1.5">
        <el-button
          type="primary"
          plain
          icon="el-icon-plus"
          size="mini"
          @click="handleAdd"
          v-hasPermi="['data:staff:add']"
        >新增
        </el-button>
      </el-col>
      <el-col :span="1.5">
        <el-button
          type="success"
          plain
          icon="el-icon-edit"
          size="mini"
          :disabled="single"
          @click="handleUpdate"
          v-hasPermi="['data:staff:edit']"
        >修改
        </el-button>
      </el-col>
      <el-col :span="1.5">
        <el-button
          type="danger"
          plain
          icon="el-icon-delete"
          size="mini"
          :disabled="multiple"
          @click="handleDelete"
          v-hasPermi="['data:staff:remove']"
        >删除
        </el-button>
      </el-col>
      <el-col :span="1.5">
        <el-button
          type="warning"
          plain
          icon="el-icon-download"
          size="mini"
          @click="handleExport"
          v-hasPermi="['data:staff:export']"
        >导出
        </el-button>
      </el-col>
      <right-toolbar :showSearch.sync="showSearch" @queryTable="getList"></right-toolbar>
    </el-row>

    <el-table v-loading="loading" :data="staffList" @selection-change="handleSelectionChange">
      <el-table-column type="selection" width="55" align="center"/>
      <el-table-column label="员工编号" align="center" prop="id"/>
      <el-table-column label="员工名称" align="center" prop="staffname"/>
      <el-table-column label="入职年限" align="center" prop="years"/>
      <el-table-column label="入职部门" align="center" prop="dept"/>
      <el-table-column label="简介视频" align="center" prop="video"/>
      <el-table-column label="个人风采" align="center" prop="photos>
         <el-upload>
         </>
      </>
      <el-table-column label=" 个人签名“ align="center" prop="signature"/>

      <el-table-column label="操作" align="center" class-name="small-padding fixed-width">
        <template slot-scope="scope">
          <el-button
            size="mini"
            type="text"
            icon="el-icon-edit"
            @click="handleUpdate(scope.row)"
            v-hasPermi="['data:staff:edit']"
          >修改
          </el-button>
          <el-button
            size="mini"
            type="text"
            icon="el-icon-delete"
            @click="handleDelete(scope.row)"
            v-hasPermi="['data:staff:remove']"
          >删除
          </el-button>
        </template>
      </el-table-column>
    </el-table>

    <pagination
      v-show="total>0"
      :total="total"
      :page.sync="queryParams.pageNum"
      :limit.sync="queryParams.pageSize"
      @pagination="getList"
    />

    <!-- 添加或修改代员工信息对话框 -->
    <el-dialog :title="title" :visible.sync="open" width="500px" append-to-body>
      <el-form ref="form" :model="form" :rules="rules" label-width="80px">
        <el-form-item label="员工名称" prop="staffname">
          <el-input v-model="form.staffname" placeholder="请输入员工名称"/>
        </el-form-item>
        <el-form-item label="入职年限" prop="years">
          <el-input v-model="form.years" placeholder="请输入入职年限"/>
        </el-form-item>
        <el-form-item label="入职部门" prop="dept">
          <el-input v-model="form.dept" placeholder="请输入入职部门"/>
        </el-form-item>
        <el-form-item label="简介视频" prop="video">
          <el-input v-model="form.video" placeholder="请输入简介视频"/>
        </el-form-item>
        <el-form-item label="个人签名" prop="signature">
          <el-input v-model="form.signature" placeholder="请输入个人签名"/>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button type="primary" @click="submitForm">确 定</el-button>
        <el-button @click="cancel">取 消</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import {listStaff, getStaff, delStaff, addStaff, updateStaff} from "@/api/data/staff";

export default {
  name: "Staff",
  data() {
    return {
      // 遮罩层
      loading: true,
      // 选中数组
      ids: [],
      // 非单个禁用
      single: true,
      // 非多个禁用
      multiple: true,
      // 显示搜索条件
      showSearch: true,
      // 总条数
      total: 0,
      // 代员工信息表格数据
      staffList: [],
      // 弹出层标题
      title: "",
      // 是否显示弹出层
      open: false,
      // 查询参数
      queryParams: {
        pageNum: 1,
        pageSize: 10,
        staffname: null,
        years: null,
        dept: null,
        video: null,
        remark: null,
        signature: null,
        extraproperties: null,
        concurrencystamp: null,
        creationtime: null,
        creatorid: null,
        lastmodificationtime: null,
        lastmodifierid: null,
        isdeleted: null,
        deleterid: null,
        deletiontime: null
      },
      // 表单参数
      form: {},
      // 表单校验
      rules: {
        creationtime: [
          {required: true, message: "$comment不能为空", trigger: "blur"}
        ],
        isdeleted: [
          {required: true, message: "$comment不能为空", trigger: "blur"}
        ],
      }
    };
  },
  created() {
    this.getList();
  },
  methods: {
    /** 查询代员工信息列表 */
    getList() {
      this.loading = true;
      listStaff(this.queryParams).then(response => {
        this.staffList = response.rows;
        this.total = response.total;
        this.loading = false;
      });
    },
    // 取消按钮
    cancel() {
      this.open = false;
      this.reset();
    },
    // 表单重置
    reset() {
      this.form = {
        id: null,
        staffname: null,
        years: null,
        dept: null,
        video: null,
        remark: null,
        signature: null,
        extraproperties: null,
        concurrencystamp: null,
        creationtime: null,
        creatorid: null,
        lastmodificationtime: null,
        lastmodifierid: null,
        isdeleted: null,
        deleterid: null,
        deletiontime: null
      };
      this.resetForm("form");
    },
    /** 搜索按钮操作 */
    handleQuery() {
      this.queryParams.pageNum = 1;
      this.getList();
    },
    /** 重置按钮操作 */
    resetQuery() {
      this.resetForm("queryForm");
      this.handleQuery();
    },
    // 多选框选中数据
    handleSelectionChange(selection) {
      this.ids = selection.map(item => item.id)
      this.single = selection.length !== 1
      this.multiple = !selection.length
    },
    /** 新增按钮操作 */
    handleAdd() {
      this.reset();
      this.open = true;
      this.title = "添加代员工信息";
    },
    /** 修改按钮操作 */
    handleUpdate(row) {
      this.reset();
      const id = row.id || this.ids
      getStaff(id).then(response => {
        this.form = response.data;
        this.open = true;
        this.title = "修改代员工信息";
      });
    },
    /** 提交按钮 */
    submitForm() {
      this.$refs["form"].validate(valid => {
        if (valid) {
          if (this.form.id != null) {
            updateStaff(this.form).then(response => {
              this.$modal.msgSuccess("修改成功");
              this.open = false;
              this.getList();
            });
          } else {
            addStaff(this.form).then(response => {
              this.$modal.msgSuccess("新增成功");
              this.open = false;
              this.getList();
            });
          }
        }
      });
    },
    /** 删除按钮操作 */
    handleDelete(row) {
      const ids = row.id || this.ids;
      this.$modal.confirm('是否确认删除代员工信息编号为"' + ids + '"的数据项？').then(function () {
        return delStaff(ids);
      }).then(() => {
        this.getList();
        this.$modal.msgSuccess("删除成功");
      }).catch(() => {
      });
    },
    /** 导出按钮操作 */
    handleExport() {
      this.download('data/staff/export', {
        ...this.queryParams
      }, `staff_${new Date().getTime()}.xlsx`)
    }
  }
};
</script>
