<script>

// 手机号验证规则
const isVerificationNumber = (number) => {
    var myreg = /^[1][3,4,5,6,7,8,9][0-9]{9}$/;
    if (!myreg.test(number)) {
        return false;
    } else {
        return true;
    }
}

// form-data转换
const obj2formdata = (obj) => {
    let formData = new FormData();
    for (const key in obj) {
        if (obj.hasOwnProperty(key)) {
            const element = obj[key];
            formData.append(key, element)
        }
    }
    return formData;
}

export default {
    isVerificationNumber, obj2formdata, 
}
</script>
