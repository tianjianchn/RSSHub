const getDataFromOneUser = require('./personalpage');

module.exports = async (ctx) => {
    const uids = ctx.query.uids || '';
    const uidArray = uids.split('_').filter(Boolean);

    const users = await Promise.all(
        uidArray.map(async (uid) => {
            ctx.params.uid = uid;
            await getDataFromOneUser(ctx);
            return ctx.state.data;
        })
    );

    const items = users
        .map((u) => u.item)
        .reduce((total, i) => total.concat(i), [])
        .sort((aa, bb) => {
            const aaDate = new Date(aa);
            const bbDate = new Date(bb);
            return aaDate - bbDate;
        });

    ctx.state.data = {
        title: '观察者-专栏',
        link: 'https://user.guancha.cn/main/special-column-list',
        description: users.map((u) => u.description).join('、'),
        item: items,
    };
};
