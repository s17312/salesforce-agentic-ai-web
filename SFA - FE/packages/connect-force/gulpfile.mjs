import gulp from "gulp";
import { rimraf } from "rimraf";
import tar from "gulp-tar";
import pkg from "./package.json" assert { type: "json" };

gulp.task("clean", function () {
  return rimraf("./build");
});

gulp.task("copy-public", function () {
  // Copy /app/public to ./public
  return gulp.src("./public/**/*").pipe(gulp.dest("./build/public"));
});

gulp.task("copy-standalone", function () {
  // Copy /app/.next/standalone to ./
  return gulp
    .src(
      "./.next/standalone/**/*",
      { dot: true } 
     )
    .pipe(gulp.dest("./build"));
});

gulp.task("create-tgz", function () {
  return (
    gulp
      .src(["./build/**/*"], { dot: true })
      .pipe(tar(`account-package-frontend-${pkg.version}.tgz`))
      .pipe(gulp.dest("./release"))
  );
});

// Define a combined task to run all the copy tasks
gulp.task("copy-all", gulp.parallel("copy-public", "copy-standalone"));

// Define default task
gulp.task("default", gulp.series("clean", "copy-all", "create-tgz", "clean"));
