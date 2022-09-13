<template>
  <div class="app-container">

    <el-form :inline="true" :model="pageInfo" class="demo-form-inline">
      <el-form-item label="小区名称">
        <el-input v-model="pageInfo.queryString" placeholder="小区名称"></el-input>
      </el-form-item>
      <el-form-item>
        <el-button type="primary" @click="this.findPage">查询</el-button>
      </el-form-item>
    </el-form>


    <el-button type="primary" @click="handleCreate()">新增角色</el-button>
    <el-table
      :data="tableData"
      style="width: 100%">
      <el-table-column
        prop="id"
        label="id"
        width="180">
      </el-table-column>
      <el-table-column
        prop="name"
        label="小区名称"
        width="180">
      </el-table-column>
      <el-table-column
        prop="address"
        label="地址">
      </el-table-column>
      <el-table-column
        prop="area"
        label="占地面积">
      </el-table-column>

      <el-table-column
        prop="greeningRate"
        label="绿化率">
      </el-table-column>
      <el-table-column
        prop="createTime"
        label="创建时间">
      </el-table-column>

      <el-table-column
        prop="updateTime"
        label="更新时间">
      </el-table-column>

      <el-table-column label="操作">
        <template slot-scope="scope">
          <el-button
            size="mini"
            type="primary"
            @click="handleEdit(scope.$index, scope.row)">编辑</el-button>
          <el-button
            size="mini"
            type="danger"
            @click="handleDelete(scope.$index, scope.row)">删除</el-button>
        </template>
      </el-table-column>
    </el-table>
    <el-pagination
      background
      @size-change="handleSizeChange"
      @current-change="handleCurrentChange"
      :current-page="pageInfo.currentPage"
      :page-sizes="[5, 10, 15, 20]"
      :page-size="pageInfo.pageSize"
      layout="total, sizes, prev, pager, next, jumper"
      :total="pageInfo.total">
    </el-pagination>

    <el-dialog title="新增/编辑小区信息" :visible.sync="dialogFormVisible" @close="resetForm()">
      <el-form :model="form" ref="formRef">
        <el-form-item label="小区名称" :label-width="formLabelWidth">
          <el-input v-model="form.name" autocomplete="off"></el-input>
        </el-form-item>
        <el-form-item label="地址" :label-width="formLabelWidth">
          <el-input v-model="form.address" autocomplete="off"></el-input>

        </el-form-item>
        <el-form-item label="占地面积" :label-width="formLabelWidth">
          <el-input v-model="form.area" autocomplete="off"></el-input>

        </el-form-item>
        <el-form-item label="绿化率" :label-width="formLabelWidth">
          <el-input v-model="form.greeningRate" autocomplete="off"></el-input>

        </el-form-item>


      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogFormVisible = false">取 消</el-button>
        <el-button type="primary" @click="onSubmit()">保 存</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import { getList ,updateCommunityInfo,addCommunity,deleteCommunity} from '@/api/table'

export default {
  filters: {
    statusFilter(status) {
      const statusMap = {
        published: 'success',
        draft: 'gray',
        deleted: 'danger'
      }
      return statusMap[status]
    }
  },
  data() {
    return {
      list: null,
      listLoading: false,

      tableData:[],
      pageInfo:{
        currentPage:1,
        pageSize:5,
        queryString:'',
        total:0
      },
      form:{
        id:'',
        name: '',
        address:'',
        area:'',
        greeningRate:0,
      },
      dialogFormVisible:false,
      formLabelWidth: '120px'
    }
  },
  created() {
    // this.fetchData()
    this.findPage();

  },
  methods: {
    fetchData() {
      this.listLoading = true
      getList().then(response => {
        this.list = response.data.items
        this.listLoading = false
      })
    },

    getAllCategories(){
      var self = this;
      axios.get("/category/getAll").then(function (res){
        self.tableData = res.data
      })
    },
    // 每页显示条数
    handleSizeChange(pageSize){
      //更新参数值
      this.pageInfo.pageSize = pageSize;
      //返回更新后的数据
      this.findPage();

    },
    //当前页发生改变触发
    handleCurrentChange(currentPage){
      this.pageInfo.currentPage = currentPage
      this.findPage()

    },
    findPage(){
      //向后台传递数据
      var self = this;
      var param = {
        currentPage:this.pageInfo.currentPage,
        pageSize:this.pageInfo.pageSize,
        queryString:this.pageInfo.queryString,
      }
      getList(param).then(function (res){
        console.log(res);
        self.tableData = res.data.records;
        self.pageInfo.total = res.data.total;
      })
    },

    handleCreate(){
      this.dialogFormVisible = true;
    },
    onSubmit(){
      let self = this;
      //判断form数据模型里id有没有值
      console.log('新增/修改按钮==========',self.form.id)

      if (self.form.id==undefined){
        console.log('=========undefined=========')
        self.form.id='';
      }

      if (self.form.id!=''){
        //不为空，id有值，进行修改操作
        var param={
          id:this.form.id,
          name: this.form.name,
          address: this.form.address,
          area: this.form.area,
          greeningRate: this.form.greeningRate,
        }
        updateCommunityInfo(param).then(function (res){
          //更新数据操作
          self.findPage();
          //关闭弹层
          self.dialogFormVisible = false;
          //重置表单数据
          self.form={};
          if(res.code==20000){
            self.$message({
              message: '恭喜你，修改小区信息成功',
              type: 'success'
            });
          }else{
            self.$message.error('错了哦，修改小区信息失败');

          }
        })
      }else{
        //得到form表单内容，封装为一个新的对象，传递到controller层
        var param={
          name: this.form.name,
          address: this.form.address,
          area: this.form.area,
          greeningRate: this.form.greeningRate,
        }
        addCommunity(param).then(function (res){
          //更新数据操作
          self.findPage();
          //关闭弹层
          self.dialogFormVisible = false;
          if(res.code==20000){
            self.$message({
              message: '恭喜你，添加小区成功',
              type: 'success'
            });
          }else{
            self.$message.error('错了哦，添加小区失败');

          }
        })
      }

    },

    handleEdit(index, row) {
      // alert(index, row);
      this.form = row
      this.dialogFormVisible = true;

    },
    handleDelete(index, row) {
      let self = this;
      // alert(index, row);
      deleteCommunity(row.id).then(function (res){
        //刷新数据
        self.findPage();
        if (res.code==20000){
          self.$message({
            message: '删除商品成功',
            type: 'success'
          });
        }else{
          self.$message.error('删除商品失败');
        }

      })
    },

    //关闭对话框后清空表单数据
    resetForm(){
      //重置form表单
      this.form={}
    }


  }
}
</script>
