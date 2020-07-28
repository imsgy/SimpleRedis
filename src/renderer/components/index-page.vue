<template>
    <div class="main_body">
        <div class="sidebar">
            <el-button type="text" style="margin-left: 38%" @click="create">
                <i class="iconfont icon-kuaisu-1">新建链接</i>
            </el-button>
            <el-menu style="text-align: center;" class="sidebar-el-menu">
                <template v-for="(item, index) in menus">
                    <el-menu-item :key="item.id" class="single-item">
                        <i></i><span slot="title" @click="fetch(index)">{{ item.name }}</span>
                    </el-menu-item>
                </template>
            </el-menu>
        </div>
        <div class="content">
            <img src="static/logo.jpg" class="logoImg">
            <el-form ref="form" v-model="server" label-width="150px" class="connectForm">
                <el-form-item label="Redis-名称：" required>
                    <el-input placeholder="请输入链接名" v-model="server.name"></el-input>
                </el-form-item>
                <el-form-item label="Redis-Host：" required>
                    <el-input placeholder="请输入Host" v-model="server.host"></el-input>
                </el-form-item>
                <el-form-item label="Redis-Port：" required>
                    <el-input placeholder="请输入Port"
                              v-model="server.port"
                              onkeyup="this.value = this.value.replace(/[^\d.]/g,'');"
                              maxlength="5"
                    ></el-input>
                </el-form-item>
                <el-form-item label="Redis-密码：" required>
                    <el-input placeholder="请输入密码" v-model="server.password" show-password></el-input>
                </el-form-item>
                <el-form-item>
                    <el-button type="primary" class="el-icon-suitcase" mini @click="save" v-if="saveVisible"> 保存
                    </el-button>
                    <el-button type="success" class="el-icon-position" mini @click="connect"> 连接</el-button>
                </el-form-item>
            </el-form>
        </div>
    </div>
</template>

<script>
    import api from '../libs/api';
    export default {
        name: "home-index",
        data() {
            return {
                menus: [],
                server: {
                    name: "",
                    host: "",
                    port: "",
                    password: "",
                    db: 0
                },
                saveVisible: true,
                nameExist: false
            }
        },
        created() {
            let menus = localStorage.getItem("menus");
            this.menus = menus ? JSON.parse(menus) : [];
        },
        methods: {
            create: function () {
                this.saveVisible = true;
                this.server = {name: "", host: "", port: "", password: "", db: 0}
            },
            fetch: function (index) {
                this.saveVisible = false;
                this.server = this.menus[index];
            },
            connect: function () {
                // 跳转
                localStorage.removeItem("server");
                localStorage.setItem("server", JSON.stringify(this.server));
                if (!this.server.name) {
                    this.$layer_message("请输入链接名");
                    return false
                }
                if (!this.server.host) {
                    this.$layer_message("请输入Host");
                    return false
                }
                if (!this.server.port) {
                    this.$layer_message("请输入Port");
                    return false
                }
                if (!this.server.password) {
                    this.$layer_message("请输入密码");
                    return false
                }
                let conn = this.$redis(this.server);
                api.RedisPing(conn).then(()=>{
                    this.$router.push("/main");
                }).catch(()=>{
                    console.log("Redis链接异常")
                })
            },
            save: function () {
                this.menus.forEach(item => {
                    if (item.name === this.server.name) {
                        this.$layer_message("该链接已存在");
                        this.nameExist = true;
                        return true
                    } else {
                        this.nameExist = false;
                        return false;
                    }
                });
                if (this.nameExist) {
                    this.$layer_message("该链接已存在");
                    return false
                }
                if (!this.server.name) {
                    this.$layer_message("请输入链接名");
                    return false
                }
                if (!this.server.host) {
                    this.$layer_message("请输入Host");
                    return false
                }
                if (!this.server.port) {
                    this.$layer_message("请输入Port");
                    return false
                }
                if (!this.server.password) {
                    this.$layer_message("请输入密码");
                    return false
                }
                if (this.menus.indexOf(this.server) >= 0) {
                    this.$layer_message("该链接已存在")
                }
                this.menus.push(this.server);
                localStorage.setItem("menus", JSON.stringify(this.menus));
            }
        }
    }
</script>

<style scoped>
    .main_body {
        display: inline
    }

    .sidebar {
        display: inline;
        position: absolute;
        left: 0;
        top: 30px;
        bottom: 0;
        overflow-y: scroll;
    }

    .sidebar::-webkit-scrollbar {
        width: 0;
    }

    .sidebar-el-menu:not(.el-menu--collapse) {
        width: 200px;
    }

    .sidebar > ul {
        height: 100%;
    }

    .el-submenu .el-menu-item {
        padding-right: 0;
        font-size: 13px !important;
        font-weight: normal;
        height: 40px;
        line-height: 40px;
    }

    /*左侧导航栏选中颜色*/
    .sidebar .el-submenu .el-menu .el-menu-item.is-active {
        background-color: #409eff !important;
        color: #fff !important;
    }

    .content {
        margin-left: 200px;
    }

    .connectForm {
        width: 40%;
        min-width: 400px;
        padding-left: calc(30% - 50px);
    }

    .icon-kuaisu-1 {
        margin-left: -20px;
        font-size: 16px;
        color: #67c23a;
    }

    .logoImg {
        width: 45%;
        height: 50%;
        margin-top: 15%;
        margin-left: 25%;
    }
</style>