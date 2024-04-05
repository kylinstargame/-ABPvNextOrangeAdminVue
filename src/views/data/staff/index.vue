<template>
  <div class="app-container">
    <el-form :model="queryParams" ref="queryForm" size="small" :inline="true" v-show="showSearch"
             label-width="68px">
      <el-form-item label="员工名称" prop="name">
        <el-input v-model="queryParams.name" placeholder="请输入员工名称" clearable
                  @keyup.enter.native="handleQuery"/>
      </el-form-item>
      <el-form-item label="入职年限" prop="years">
        <el-input v-model="queryParams.years" placeholder="请输入入职年限" clearable
                  @keyup.enter.native="handleQuery"/>
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
      <el-table-column label="员工名称" align="center" prop="name"/>
      <el-table-column label="入职年限" align="center" prop="years"/>
      <el-table-column label="入职部门" align="center" prop="dept"/>
      <el-table-column label="简介视频" align="center" prop="video"/>
      <el-table-column label="个人风采" width="320px" align="center" prop="photos">
        <template slot-scope="scope">
          <img v-if="scope.row.photos!= null&& scope.row.photos.length>0" :src="item"
               v-for="(item) in scope.row.photos"
               style="width: 60px; height: 60px; padding-right: 1px" fit="fit" lazy/>
          <el-button v-if="scope.row.photos!= null&& scope.row.photos.length==0" size="mini" type="text"
                     icon="el-icon-edit" @click="handleUpdate(scope.row)"
                     v-hasPermi="['system:role:edit']"
          >上传风采照片
          </el-button>
        </template>
      </el-table-column>

      <el-table-column label="个人签名" align="center" prop="signature">
        <template slot-scope="scope">

          <img v-if="scope.row.signature!= ''&&scope.row.signature!= null" :src="scope.row.signature" alt=""
               style="width: 60px; height: 60px; padding-right: 1px" lazy/>
          <el-button g v-else size="mini" type="text" icon="el-icon-edit" @click="handleUpdate(scope.row)"
                     v-hasPermi="['system:role:edit']"
          >上传签名照片
          </el-button>
        </template>
      </el-table-column>
      <el-table-column label="操作" align="center" class-name="small-padding fixed-width">
        <template slot-scope="scope">
          <el-button size="mini" type="text" icon="el-icon-edit" @click="handleUpdate(scope.row)"
                     v-hasPermi="['data:staff:edit']">
            修改
          </el-button>
          <el-button size="mini" type="text" icon="el-icon-delete" @click="handleDelete(scope.row)"
                     v-hasPermi="['data:staff:remove']">
            删除
          </el-button>
        </template>
      </el-table-column>
    </el-table>

    <pagination v-show="total>0" :total="total" :page.sync="queryParams.pageNum" :limit.sync="queryParams.pageSize"
                @pagination="getList"/>

    <el-dialog :title="title" :visible.sync="open" width="1200px" append-to-body>
      <el-form ref="form" :model="form" :rules="rules" label-width="80px">
        <el-form-item label="员工名称" prop="name">
          <el-input v-model="form.name" placeholder="请输入员工名称"/>
        </el-form-item>
        <el-form-item label="入职年限" prop="years">
          <el-input v-model="form.years" placeholder="请输入入职年限"/>
        </el-form-item>
        <el-form-item label="入职部门" prop="dept">
          <el-input v-model="form.dept" placeholder="请输入入职部门"/>
        </el-form-item>
        <el-form-item label="简介视频" prop="video">
          <el-input v-model="form.video" placeholder="请输入简介视频"/>
          <el-upload :action="uploadUrl" :auto--upload="false" :multiple="false"
                     :on-success="handleVideoUploadSuccess">
            <i slot="default" class="el-icon-plus"></i>
          </el-upload>
        </el-form-item>
        <el-form-item label="个人风采" prop="photos">
          <el-upload :action="uploadUrl" :auto--upload="false" :limit="5" list-type="picture-card"
                     style="display: inline"
                     :on-exceed="handleExceed"
                     :before-upload="beforeUpload"
                     :file-list="form.photoList" :on-success="handlePhotosUploadSuccess">
            <i slot="default" class="el-icon-plus"></i>
<!--            <div slot="file" slot-scope="{file}">-->
<!--              <img class="el-upload-list__item-thumbnail" :src="file.url" alt="">-->
<!--              <span class="el-upload-list__item-actions">-->
<!--	                            <span class="el-upload-list__item-preview" @click="handlePictureCardPreview(file)">-->
<!--		                            <i class="el-icon-zoom-in"></i>-->
<!--	                            </span>-->
<!--	                            <span v-if="!disabled" class="el-upload-list__item-delete"-->
<!--                                    @click="handleDownload(file)">-->
<!--	                                <i class="el-icon-download"></i>-->
<!--	                            </span>-->
<!--	                            <span v-if="!disabled" class="el-upload-list__item-delete"-->
<!--                                    @click="handleRemove(file,fileList)">-->
<!--	                                <i class="el-icon-delete"></i>-->
<!--	                            </span>-->
<!--                            </span>-->
<!--            </div>-->
          </el-upload>
        </el-form-item>
        <el-form-item label="个人签名" :limit="1" prop="signature">
          <ul
            v-if="this.form.signature!=null&&this.form.signature!=''"
            class="el-upload-list el-upload-list--picture-card" style="display: inline">
            <li tabindex="0" class="el-upload-list__item is-success"
                style="">
              <div>
                <img :src="this.form.signature" alt="" class="el-upload-list__item-thumbnail">
                <span class="el-upload-list__item-actions">
		                            <span class="el-upload-list__item-preview">
			                            <i class="el-icon-zoom-in"></i>
		                            </span>
		                            <span class="el-upload-list__item-delete">
			                            <i class="el-icon-download"></i>
		                            </span>
		                            <span class="el-upload-list__item-delete">
			                            <i class="el-icon-delete"></i>
		                            </span>
	                            </span>
              </div>
            </li>
          </ul>
          <el-upload v-else :action="uploadUrl" :auto--upload="false" :multiple="false" list-type="picture-card"
                     :file="form.signature" :on-success="handlesignatureUploadSuccess">
            <i slot="default" class="el-icon-plus"></i>
            <div slot="file" slot-scope="{file}">
              <img class="el-upload-list__item-thumbnail" :src="file.url" alt="">
              <span class="el-upload-list__item-actions">
                            <span class="el-upload-list__item-preview" @click="handlePictureCardPreview(file)">
	                            <i class="el-icon-zoom-in"></i>
                            </span>
                            <span v-if="!disabled" class="el-upload-list__item-delete"
                                  @click="handleDownload(file)">
                                <i class="el-icon-download"></i>
                            </span>
                            <span v-if="!disabled" class="el-upload-list__item-delete" @click="handleRemove(file)">
                                <i class="el-icon-delete"></i>
                            </span>
                        </span>
            </div>
          </el-upload>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button type="primary" @click="submitForm">确 定</el-button>
        <el-button @click="cancel">取 消</el-button>
      </div>
    </el-dialog>
    <el-dialog :visible.sync="dialogVisible">
      <img width="100%" :src="dialogImageUrl" alt="">
    </el-dialog>
  </div>
</template>

g
<script>
import {addStaff, delStaff, getStaff, listStaff, updateStaff} from '@/api/data/staff'

export default {
  name: 'Staff',
  data() {
    return {
      uploadUrl: process.env.VUE_APP_BASE_API + '/common/upload2redis', // 上传的图片服务器地址
      dialogImageUrl: '',
      dialogVisible: false,
      disabled: false,
      // 遮罩层
      loading:
        true,
      // 选中数组
      ids:
        [],
      // 非单个禁用
      single:
        true,
      // 非多个禁用
      multiple:
        true,
      // 显示搜索条件
      showSearch:
        true,
      // 总条数
      total: 0,
      // 代员工信息表格数据
      staffList:
        [],
      // 弹出层标题
      title:
        '',
      // 是否显示弹出层
      open:
        false,
      // 查询参数
      queryParams:
        {
          pageNum: 1,
          pageSize: 10,
          name: null,
          years: null,
          dept: null,
          video: null,
          remark: null,
          signature: null
        },
      // 表单参数
      form: {}
      ,
      // 表单校验
      rules: {
        creationtime: [
          {required: true, message: '$comment不能为空', trigger: 'blur'}
        ],
        isdeleted:
          [
            {required: true, message: '$comment不能为空', trigger: 'blur'}
          ]
      }
    }

  },
  created() {
    this.getList()
  },
  methods: {
    /** 查询代员工信息列表 */
    getList() {
      this.loading = true
      listStaff(this.queryParams).then(response => {

        console.log(JSON.stringify(response))
        this.staffList = response.data.items
        this.total = response.data.totalCount
        this.loading = false
      })
    },
    // 取消按钮
    cancel() {
      this.open = false
      this.reset()
    },
    // 表单重置
    reset() {
      this.form = {

        name: 'll',
        years: 3,
        dept: 'll',
        video: 'll',
        remark: 'll',
        signature: '',
        photos: [],
        photoList: []

      }
      this.resetForm('form')
    },
    /** 搜索按钮操作 */
    handleQuery() {
      this.queryParams.pageNum = 1
      this.getList()
    },
    /** 重置按钮操作 */
    resetQuery() {
      this.resetForm('queryForm')
      this.handleQuery()
    },
    // 多选框选中数据
    handleSelectionChange(selection) {
      this.ids = selection.map(item => item.id)
      this.single = selection.length !== 1
      this.multiple = !selection.length
    },
    /** 新增按钮操作 */
    handleAdd() {
      this.reset()
      this.open = true
      this.title = '添加员工信息'

    },
    /** 修改按钮操作 */
    handleUpdate(row) {
      this.reset()
      const id = row.id || this.ids
      getStaff(id).then(response => {
        this.form = response.data
        this.form.photoList = this.form.photos.map((x) => {
          let item = {}
          item.uid = x.split('=').pop();
          item.url = x;
          return item;
        });
        this.open = true
        this.title = '修改员工信息'
      })
    },
    /** 提交按钮 */
    submitForm() {
      this.$refs['form'].validate(valid => {
        if (valid) {
          if (this.form.id != null) {
            updateStaff(this.form).then(response => {
              this.$modal.msgSuccess('修改成功')
              this.open = false
              this.getList()
            })
          } else {
            console.log(JSON.stringify(this.form))
            addStaff(this.form).then(response => {
              this.$modal.msgSuccess('新增成功')
              this.open = false
              this.getList()
            })
          }
        }
      })
    }
    ,
    /** 删除按钮操作 */
    handleDelete(row) {
      const ids = row.id || this.ids
      this.$modal.confirm('是否确认删除代员工信息编号为"' + ids + '"的数据项？').then(function () {
        return delStaff(ids)
      }).then(() => {
        this.getList()
        this.$modal.msgSuccess('删除成功')
      }).catch(() => {
      })
    }
    ,
    /** 导出按钮操作 */
    handleExport() {
      this.download('data/staff/export', {
        ...this.queryParams
      }, `staff_${new Date().getTime()}.xlsx`)
    },
    handleRemove(file, fileList) {
      console.log(file, fileList);
    },
    // handleRemove(file,fileList) {
    //   // fileList.pop(file);
    //
    //   console.log(JSON.stringify(file))
    //
    //   // this.form.photos.pop(file.url)
    //    console.log(JSON.stringify(this.form.photoList))
    //   // var index=this.form.photoList.findIndex(x=>x.uid==file.uid);
    //   // this.form.photoList=this.form.photoList.slice(index,1)
    //   // console.log(">>>>>>>>>"+index);
    // }
    // ,
    handlePictureCardPreview(file) {
      console.log('-----' + file)
      this.dialogImageUrl = file.url
      this.dialogVisible = true
    }
    ,
    handleDownload(file) {
      console.log(file.url)
    }
    ,
    handlePhotosUploadSuccess(response, file, fileList) {

      console.log(JSON.stringify(file))

      console.log(JSON.stringify(fileList))
      console.log(JSON.stringify(this.form.photoList))
      this.dialogImageUrl = response.data
      if (!this.form.photos) {
        this.form.photos = []
      }
      this.form.photos.push(response)

    }
    ,
    handlesignatureUploadSuccess(response, file, fileList) {

      this.dialogImageUrl = response.data

      this.form.signature = response
      console.log('>>>>>>>>' + JSON.stringify(fileList))

    },
    handleVideoUploadSuccess(response, file, fileList) {

      console.log('>>>>>>>>' + JSON.stringify(fileList))
      this.form.video = response

    },
    handleExceed(files, fileList) {

      this.$message.warning(`当前限制选择 3 个文件，本次选择了 ${files.length} 个文件，共选择了 ${files.length + fileList.length} 个文件`)
    }
    ,
    beforeUpload(file) {
      console.log(JSON.stringify(file));
      // 判断图片是否大于2M
      const isLt10M = file.size / 1024 / 1024 < 10;
      // const fileType = file.name.substring(file.name.lastIndexOf('.')+1)
      // 判断图片的类型
      // const isJpg = file.type == 'image/jpeg' || file.type == 'image/jpg' || file.type == 'image/png' || file.type == 'image/gif'
      // if (!isJpg) {
      //   this.$message.error('只能上传jpg, jpeg, png, gif格式的图片！')
      //   return false
      // }
      if (!isLt10M) {
        this.$message.error('上传图片大小不能超过 10MB!');
        return false
      }
    }
    ,
  }
}
</script>
